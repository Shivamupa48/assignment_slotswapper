# 🛒 Marketplace & 🔔 Notifications Feature Guide

## Overview

This document explains how the **Marketplace** and **Notifications** features work in SlotSwapper, including the complete user flow and backend logic.

---

## 🛒 MARKETPLACE FEATURE

### Purpose
The Marketplace allows users to browse time slots that other users have marked as "swappable" and request to swap them with their own swappable slots.

### How It Works

#### Step 1: User Prepares Their Slot
1. User goes to **Dashboard**
2. Creates an event (e.g., "Team Meeting" on Tuesday 10-11 AM)
3. Clicks **"Make Swappable"** button
4. Event status changes from `BUSY` → `SWAPPABLE`

#### Step 2: Browse Marketplace
1. User navigates to **Marketplace** page
2. System calls: `GET /api/swap/swappable-slots`
3. Backend returns:
   - All events with status `SWAPPABLE`
   - **Excludes** the logged-in user's own slots
   - Includes owner's name and email
   - Sorted by start time

**Backend Logic:**
```javascript
Event.find({
  status: 'SWAPPABLE',
  userId: { $ne: req.user._id } // Not equal to current user
})
.populate('userId', 'name email')
```

#### Step 3: Request a Swap
1. User sees available slots in card layout
2. Each card shows:
   - Event title
   - Start/End time
   - Owner's name
   - "Swappable" badge
   - **"Request Swap"** button
3. User clicks **"Request Swap"** on a slot they want
4. Modal opens showing:
   - **"They are offering"**: The slot details from other user
   - **"Select one of your swappable slots"**: List of user's own swappable slots
5. User selects one of their own swappable slots
6. System calls: `POST /api/swap/swap-request`

**Request Body:**
```json
{
  "mySlotId": "user_own_slot_id",
  "theirSlotId": "other_user_slot_id"
}
```

#### Step 4: Backend Validates & Creates Request

**Backend Checks:**
1. ✅ Both slots exist
2. ✅ `mySlotId` belongs to current user
3. ✅ Both slots have status `SWAPPABLE`
4. ✅ User is not trying to swap with themselves
5. ✅ Creates `SwapRequest` record with status `PENDING`
6. ✅ Updates both slots to `SWAP_PENDING` (locks them from other swaps)

**Database Changes:**
```javascript
// Create swap request
SwapRequest.create({
  requesterSlotId: mySlotId,
  targetSlotId: theirSlotId,
  requesterUserId: current_user_id,
  targetUserId: other_user_id,
  status: 'PENDING'
})

// Lock both slots
mySlot.status = 'SWAP_PENDING'
theirSlot.status = 'SWAP_PENDING'
```

#### Step 5: Success Feedback
- Success message: "Swap request created successfully!"
- Modal closes
- Marketplace refreshes (the slot is now gone, as it's `SWAP_PENDING`)
- User's slot also disappears from their dashboard (now `SWAP_PENDING`)

---

## 🔔 NOTIFICATIONS FEATURE

### Purpose
The Notifications page shows:
- **Incoming Requests**: Swap requests other users sent to you
- **Outgoing Requests**: Swap requests you sent to others

### How It Works

#### Step 1: View Notifications
1. User navigates to **Notifications** page
2. System calls: `GET /api/swap/swap-requests`
3. Backend returns two lists:

**Backend Query:**
```javascript
// Incoming: Where current user is the target
const incoming = SwapRequest.find({
  targetUserId: req.user._id,
  status: 'PENDING'
})

// Outgoing: Where current user is the requester
const outgoing = SwapRequest.find({
  requesterUserId: req.user._id
})
```

#### Step 2: Incoming Requests Section

**What You See:**
- List of swap requests others sent to you
- For each request:
  - **Who wants to swap**: Requester's name
  - **Their slot**: What they're offering (title, time)
  - **Your slot**: What they want from you (title, time)
  - **Accept** button (green)
  - **Reject** button (red)

**Example Display:**
```
John Doe wants to swap:

Their slot: Team Meeting
  2025-01-15 10:00 AM - 11:00 AM

Your slot: Focus Block
  2025-01-16 2:00 PM - 3:00 PM

[Accept] [Reject]
```

#### Step 3: Accepting a Swap

When you click **Accept**:
1. System calls: `POST /api/swap/swap-response/:requestId`
2. Request body: `{ "accepted": true }`

**Backend Logic (Accept):**
```javascript
// 1. Verify swap request is still pending
// 2. Get both slots
const requesterSlot = Event.findById(requesterSlotId)
const targetSlot = Event.findById(targetSlotId)

// 3. EXCHANGE THE OWNERS
const tempUserId = requesterSlot.userId
requesterSlot.userId = targetSlot.userId  // Their slot → You
targetSlot.userId = tempUserId            // Your slot → Them

// 4. Set both back to BUSY
requesterSlot.status = 'BUSY'
targetSlot.status = 'BUSY'

// 5. Update swap request
swapRequest.status = 'ACCEPTED'
```

**Result:**
- ✅ Their slot (e.g., "Team Meeting") now belongs to YOU
- ✅ Your slot (e.g., "Focus Block") now belongs to THEM
- ✅ Both appear in respective dashboards as `BUSY` events
- ✅ Success message: "Swap accepted! The slots have been exchanged."

#### Step 4: Rejecting a Swap

When you click **Reject**:
1. System calls: `POST /api/swap/swap-response/:requestId`
2. Request body: `{ "accepted": false }`

**Backend Logic (Reject):**
```javascript
// 1. Get both slots
const requesterSlot = Event.findById(requesterSlotId)
const targetSlot = Event.findById(targetSlotId)

// 2. Set both back to SWAPPABLE (unlock them)
requesterSlot.status = 'SWAPPABLE'
targetSlot.status = 'SWAPPABLE'

// 3. Update swap request
swapRequest.status = 'REJECTED'
```

**Result:**
- ✅ Both slots return to `SWAPPABLE` status
- ✅ They reappear in Marketplace
- ✅ They can be used in other swap requests
- ✅ Success message: "Swap rejected. The slots are available again."

#### Step 5: Outgoing Requests Section

**What You See:**
- List of swap requests you sent to others
- For each request:
  - **Who you sent it to**: Target user's name
  - **Your slot**: What you're offering
  - **Their slot**: What you want
  - **Status Badge**:
    - ⏳ **PENDING** (yellow) - Waiting for response
    - ✅ **ACCEPTED** (green) - Swap completed
    - ❌ **REJECTED** (red) - They declined

**Note:** Outgoing requests are read-only (you can't cancel them)

---

## 📊 Complete User Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    USER A & USER B FLOW                       │
└─────────────────────────────────────────────────────────────┘

USER A:
1. Create Event "Team Meeting" (Tue 10-11 AM)
2. Mark as "Swappable" → Status: SWAPPABLE
3. Goes to Marketplace → Sees nothing (no other users yet)

USER B:
1. Create Event "Focus Block" (Wed 2-3 PM)
2. Mark as "Swappable" → Status: SWAPPABLE
3. Goes to Marketplace → Sees User A's "Team Meeting"
4. Clicks "Request Swap"
5. Selects their "Focus Block" to offer
6. Backend creates SwapRequest (PENDING)
   - Both slots → SWAP_PENDING
   - SwapRequest: requester=User B, target=User A

USER A:
7. Goes to Notifications → Sees INCOMING request:
   "User B wants to swap:
    Their: Focus Block (Wed 2-3 PM)
    Your: Team Meeting (Tue 10-11 AM)"
8. Clicks "Accept"

BACKEND:
9. Exchanges slot owners:
   - Team Meeting (Tue 10-11 AM) → Now belongs to User B
   - Focus Block (Wed 2-3 PM) → Now belongs to User A
10. Both slots → BUSY
11. SwapRequest → ACCEPTED

RESULT:
✅ User A's Dashboard: Has "Focus Block" (Wed 2-3 PM) as BUSY
✅ User B's Dashboard: Has "Team Meeting" (Tue 10-11 AM) as BUSY
✅ Notifications: Shows swap as "✅ Accepted"
```

---

## 🔐 Security & Validation

### Marketplace Security:
- ✅ JWT authentication required
- ✅ Only shows other users' slots (not your own)
- ✅ Only `SWAPPABLE` slots are shown
- ✅ Can't swap with yourself
- ✅ Slots locked when request is created

### Notifications Security:
- ✅ JWT authentication required
- ✅ Can only respond to requests sent TO you
- ✅ Can't modify already-processed requests
- ✅ Slots must be in `SWAP_PENDING` to accept

---

## 🎯 Key Features

### Real-time Updates:
- After creating a swap request → Marketplace refreshes
- After accepting/rejecting → Dashboard updates automatically
- No page refresh needed

### Status Management:
```
BUSY → [Make Swappable] → SWAPPABLE → [Request Swap] → SWAP_PENDING → [Accept/Reject]
                                                                          ↓
                                                                    ACCEPTED → BUSY
                                                                    REJECTED → SWAPPABLE
```

### Error Handling:
- If slot no longer exists → Error message
- If slot status changed → Validation error
- If unauthorized action → 403 Forbidden
- Clear error messages shown to user

---

## 📝 API Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/swap/swappable-slots` | Get all swappable slots from other users |
| POST | `/api/swap/swap-request` | Create a swap request |
| GET | `/api/swap/swap-requests` | Get incoming & outgoing requests |
| POST | `/api/swap/swap-response/:id` | Accept or reject a swap request |

---

## 🧪 Testing the Features

### Test Scenario 1: Successful Swap
1. Create User A account
2. Create User B account (different browser/incognito)
3. User A: Create event, make swappable
4. User B: Go to Marketplace, request swap
5. User A: Go to Notifications, accept
6. Verify: Both users' dashboards show swapped slots

### Test Scenario 2: Rejected Swap
1. Follow steps 1-4 above
2. User A: Click "Reject" instead
3. Verify: Both slots return to Marketplace as swappable

### Test Scenario 3: View Outgoing Status
1. User B: Go to Notifications
2. See outgoing request with "⏳ Pending" status
3. After User A accepts: Status changes to "✅ Accepted"

---

This completes the Marketplace and Notifications feature guide! 🎉

