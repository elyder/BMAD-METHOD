## Case Title
Interval timer webpage

----

## Background
There are many different apps available for training with intervals, but i not found any that satisfy my own needs completely.

----

## Purpose
The goal is to build a next-js web page that will allow me to set up, store and run different training intervals according to a users own needs.

----

## Target Users
- **Basic user:** A basic user wanting to detail their own workout interval sessions. The sessions should be saved locally and be available to the user each time the web-page is accessed.  

----

## Core Functionality
- Landing page with the following functions:
   - overview of created sessions
   - "Create new session" function to add a new session.
   - "Edit existing session" function for editing, deleting or duplicating existing sessions.
   - A predefined workout sessions that can be modified and then saved as a new session.

----

### Must Have (MVP)
- **List of workout sessions:** Up-to-date listings of all saved workout sessions.
- **Session Functions:** Core function for creating, deleting and duplicating workout sessions.
- **Run function:** Core function for running predetermined workout sessions.

----

### Nice to Have (Optional Extensions)
- **Logging function:** Core function for logging completed runs of workout sessions.
   The log shall contain the following entries:
      1. Date and time completed
      2. Workout session 
      3. Freetext entry field where user can record own reflections from the completed session.

----

## User Stories

### Basic User Flows

#### Basic User Flow 1: Creating a new workout session

**Objective:**  
User shall be able to design a workout session after own wishes.
The workout sessions will as a default contain three items:
   1. Warm-up: 10:00 (mm:ss)
   2. Actions: 30:00 (mm:ss)
   3. Cooldown: 10:00 (mm:ss)
Users can add, edit, duplicate and delete the workout items as required.
Each workout item shall have its own countdown timer, which can be programmed by the user.
Each workout item shall have a background colour defined by the user.
There shall be no restrictions on the number of items in one workout session.
The user shall be promted to name each session before saving it, and shall be alerted if the name has previously has been used.

**Flow Steps:**
   1. Clicking "Create New Session" shall load a predifined session containing the three items named in the Objective of this story.
   2. Each item shall be able to be edited, duplicated or deleted as required.
   3. Each item shall contain a title to be displayed during running of the session.
   4. Each item shall have its own countdown timer.
   5. It shall be possible to repeat items of the same sort (warmup, actions, cooldown) defined by a set function, stating how many times the item shall be repeated before moving on to next item. During th running of a set the text "XX of XX" shall be displayed, indicating the current progress of a set.
   6. During the creation of a session a total time shall show the duration of the session, and shall be updated dynamically when items are added/duplicated/deleted.


#### Basic User Flow 2: Duplicating an existing workout session

**Objective:**  
A user shall be able to duplicate any saved workout session and shall be prompted to save it with a new name or to discard the changes.
On each saved session there shall be a menu enabling duplicating the existing session.

**Flow Steps:**
   1. Clicking "Duplicate Session" shall copy the selected session and open it for editing.
   2. Editing shall follow the steps described in User flow 1 from step 2 and onwards.


#### Basic User Flow 3: Editing an existing workout session

**Objective:**  
A user shall be able to edit any saved workout session and shall be prompted to save or discard changes when finished.
On each saved session there shall be a menu enabling editing the existing session.


#### Basic User Flow 4: Deleting an existing workout session

**Objective:**
A user shall be able to delete any saved workout session but shall be prompted to confirm the deletion.
On each saved session there shall be a menu enabling deleting the existing session.
Before deleting a session the user shall be prompted to confirm the deletion.


#### Basic User Flow 5: Running an existing workout session

**Objective:**  
The user should be able to run an existing workout session. The session shall be executed in fullscreen mode.

**Flow Steps:**
   1. The user navigates to the desired existing workout session and selects the "RUN" option.
   2. The workout session starts with the first task, and at the bottom of the screen it shows which task is to follow.
   3. A countdown timer shows the time left of the current task
   4. A progress bar at the top of the screen shows the progress and a countdown of the entire workout session.
   5. A pause/resume function is displayed for the session to be paused/resumed at any time.
   6. A skip function is displayed for the possibility to skip to the next task in the session.
   7. A end session function should be visible when the session is paused, enabling the user to exit the session.
   8. After session ends the user shall be prompted to enter freetext which will be saved with the session log.
   9. The session log shall be saved to local storage.

----

## Technical Constraints
   1. Fully responsive design for mobile/tablet/PC.
   2. The web page should access local storage for saving and accessing workout sessions and logs.

----

## Success Criteria
   1. The app is fully functional on all devices.  
   2. The app acesses local storage for saving and editing sessions and logs.
   3. Users can create/edit/duplicate and delete workout sessions.  
   4. Users can run/pause/skip/exit active workout sessions.  
   5. Users can enter own reflections into the log.  

----

## Technical Architecture
- App built with Next-JS