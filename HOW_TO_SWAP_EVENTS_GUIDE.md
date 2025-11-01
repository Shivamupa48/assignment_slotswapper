# 🔄 How to Swap Events - Complete Step-by-Step Guide

## Overview

This guide explains exactly how to swap your events with other users in SlotSwapper. Follow these steps carefully!

---

## 📋 Prerequisites

Before you can swap events, you need:
1. ✅ A registered account (signup → login)
2. ✅ At least ONE event created in your Dashboard
3. ✅ That event marked as "Swappable"

---

## 🎯 Complete Swap Process

### Step 1: Create an Event

1. **Login** to your account
2. Go to **Dashboard** (My Calendar)
3. Click **"+ Create Event"** button
4. Fill in the form:
   - **Event Title**: e.g., "Team Meeting", "Focus Block"
   - **Start Time**: Select date and time
   - **End Time**: Select date and time (must be after start time)
5. Click **"Create Event"**

**Result:** Event is created with status `BUSY` (not swappable yet)

---

### Step 2: Make Your Event Swappable

1. In your **Dashboard**, find the event you just created
2. Click the **"Make Swappable"** button (green button)
3. Event status changes: `BUSY` → `SWAPPABLE` ✅

**Result:** Your event is now available for swapping in the Marketplace!

---

### Step 3: Browse Available Slots (Marketplace)

1. Go to **Marketplace** page (click "Marketplace" in navbar)
2. You'll see all slots from OTHER users that are marked as swappable
3. Each card shows:
   - Event title
   - Start/End time
   - Owner's name
   - "Swappable" badge

**Note:** You won't see YOUR OWN slots here (by design)

---

### Step 4: Request a Swap

1. In **Marketplace**, find a slot you want to swap for
2. Click **"Request Swap"** button on that slot
3. A **modal window** opens showing:
   - **They are offering:** The slot details you want
   - **Select one of your swappable slots:** Your available slots list
4. **Click on one of YOUR swappable slots** (the one you want to offer)
5. The swap request is created automatically

**Backend Process:**
- ✅ Both slots are locked (status → `SWAP_PENDING`)
- ✅ SwapRequest record is created with status `PENDING`
- ✅ Request is sent to the other user

**Result:** 
- Success message: "Swap request created successfully!"
- The slot disappears from Marketplace (it's now locked)
- Your slot also disappears from Dashboard (now locked too)

---

### Step 5: Wait for Response (Notifications)

Go to **Notifications** page to see:

#### Outgoing Requests (You Sent)
- Shows swap requests YOU sent to others
- Status: **⏳ Pending** (waiting for their response)
- You can see:
  - Who you sent it to
  - Your slot (what you're offering)
  - Their slot (what you want)

**You cannot cancel - you must wait for their decision!**

---

### Step 6: They Respond (Their Notifications)

The other user:
1. Goes to their **Notifications** page
2. Sees **Incoming Requests** section
3. Sees your swap request with:
   - Your name
   - Your slot details (what you're offering)
   - Their slot details (what you want)
4. They click either:
   - **"Accept"** ✅ → Swap happens!
   - **"Reject"** ❌ → Swap is cancelled

---

### Step 7: Swap Accepted! ✅

**When they click "Accept":**

**Backend automatically:**
1. ✅ Exchanges slot owners:
   - Their slot → Now belongs to YOU
   - Your slot → Now belongs to THEM
2. ✅ Sets both slots to `BUSY`
3. ✅ Updates SwapRequest status to `ACCEPTED`

**You see:**
- ✅ Success message in Notifications
- ✅ In **Dashboard**: Their slot now appears as YOUR event
- ✅ In **Notifications**: Outgoing request shows "✅ Accepted"

**They see:**
- ✅ In **Dashboard**: Your slot now appears as THEIR event
- ✅ In **Notifications**: Incoming request disappears

---

### Step 8: Swap Rejected ❌

**When they click "Reject":**

**Backend automatically:**
1. ✅ Unlocks both slots (status → `SWAPPABLE`)
2. ✅ Updates SwapRequest status to `REJECTED`

**You see:**
- ✅ In **Notifications**: Outgoing request shows "❌ Rejected"
- ✅ In **Dashboard**: Your slot reappears as `SWAPPABLE`
- ✅ In **Marketplace**: Both slots are available again

---

## 📊 Visual Flow Example

```
USER A:
1. Creates "Team Meeting" (Tue 10-11 AM)
2. Makes it Swappable ✅

USER B:
3. Creates "Focus Block" (Wed 2-3 PM)
4. Makes it Swappable ✅
5. Goes to Marketplace → Sees User A's "Team Meeting"
6. Clicks "Request Swap" → Selects "Focus Block"
   → SwapRequest created (PENDING)
   → Both slots locked (SWAP_PENDING)

USER A:
7. Goes to Notifications
8. Sees INCOMING request from User B
9. Clicks "Accept" ✅

RESULT:
- Team Meeting (Tue 10-11 AM) → Now belongs to User B
- Focus Block (Wed 2-3 PM) → Now belongs to User A
- Both are BUSY status
- SwapRequest → ACCEPTED

FINAL STATE:
User A's Dashboard: Shows "Focus Block" (Wed 2-3 PM)
User B's Dashboard: Shows "Team Meeting" (Tue 10-11 AM)
```

---

## 🔔 Notifications Feature Explained

### Incoming Requests Section

**What it shows:**
- Swap requests OTHER users sent TO you
- Only shows `PENDING` requests (awaiting your response)

**What you can do:**
- ✅ **Accept**: Complete the swap (slots are exchanged)
- ❌ **Reject**: Cancel the swap (slots are unlocked)

**Information displayed:**
- Requester's name
- Their slot (what they're offering)
- Your slot (what they want from you)

---

### Outgoing Requests Section

**What it shows:**
- Swap requests YOU sent to others
- Shows ALL statuses: PENDING, ACCEPTED, REJECTED

**Status meanings:**
- **⏳ PENDING** (Yellow): Waiting for their response
- **✅ ACCEPTED** (Green): Swap completed successfully
- **❌ REJECTED** (Red): They declined your request

**Information displayed:**
- Target user's name
- Your slot (what you're offering)
- Their slot (what you want)

**What you can do:**
- ⚠️ **Nothing** - You cannot cancel or modify outgoing requests
- ⚠️ You must wait for their decision

---

## ⚠️ Important Rules

1. **You must have at least one swappable slot** to request a swap
2. **You cannot swap with yourself** (both slots must belong to different users)
3. **Slots are locked once a request is created** (can't be used in other swaps)
4. **You cannot cancel a pending request** - only the recipient can accept/reject
5. **Once accepted, swap is permanent** (slots are exchanged)
6. **If rejected, both slots become available again**

---

## 🧪 Testing the Complete Flow

### Test with Two Browser Windows:

**Window 1 (User A):**
1. Sign up: `alice@test.com`
2. Create event "Team Meeting" (Tue 10 AM)
3. Make swappable
4. Go to Notifications (wait)

**Window 2 (User B):**
1. Sign up: `bob@test.com`
2. Create event "Focus Block" (Wed 2 PM)
3. Make swappable
4. Go to Marketplace → See User A's slot
5. Request swap → Select "Focus Block"
6. Check Notifications → See outgoing request (Pending)

**Back to Window 1 (User A):**
7. Check Notifications → See incoming request
8. Click "Accept"

**Both Windows:**
9. Check Dashboards → Slots should be swapped!
10. Check Notifications → Request shows "Accepted"

---

## 🎯 Quick Reference

| Action | Where | What Happens |
|--------|-------|--------------|
| Create Event | Dashboard | Event created as `BUSY` |
| Make Swappable | Dashboard | Status: `BUSY` → `SWAPPABLE` |
| Browse Slots | Marketplace | See other users' swappable slots |
| Request Swap | Marketplace | Click "Request Swap" → Select your slot |
| Check Requests | Notifications | See incoming (waiting) and outgoing (sent) |
| Accept Swap | Notifications | Click "Accept" → Slots are exchanged |
| Reject Swap | Notifications | Click "Reject" → Slots are unlocked |

---

## ❓ Common Questions

**Q: Can I swap multiple events at once?**
A: No, each swap is one-to-one (one of your slots for one of their slots).

**Q: What if I delete an event that's in a pending swap?**
A: The swap request will remain, but it may cause errors. Don't delete events involved in swaps.

**Q: Can I see who has requested swaps from me?**
A: Yes! Check the "Incoming Requests" section in Notifications.

**Q: How long does a swap request stay pending?**
A: Forever, until the recipient accepts or rejects it.

**Q: Can I swap a slot that's already pending?**
A: No, once a slot is in a pending swap, it's locked and cannot be used in other requests.

---

This completes the guide! Follow these steps to successfully swap your events! 🎉

