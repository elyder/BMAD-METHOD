## Case Title
Interval timer webpage

----

## Background
There are many different apps available for training with intervals, but i not found any that satisfy my own needs completely.

----

## Purpose
The goal is to build a web page that will allow me to set up, store and run different training intervals according to a users own needs. The web pages shall be published within a separate folder on an existing website, but accessed only through a direct URL entered into the browser: https://mittatelier.no/intervall

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
   - A sorting function that allows sorting of saved sessions according to the following criteria:
      - Date/time created
      - Date/time last used
      - Workout total time

----

### Must Have (MVP)
- **List of workout sessions:** Up-to-date listings of all saved workout sessions.
- **Session Functions:** Core function for creating, deleting and duplicating workout sessions.
- **Run function:** Core function for running workout sessions.

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
   3. Cool-down: 10:00 (mm:ss)
Users can add, edit, duplicate and delete the workout items as required.
Each workout item shall have the option to define number of sets for the item to be repeated before running next item.
Each workout item and subitem shall have the option to set a speed, denominated as km/t, and can be adjusted in increments of 0,1.
Each workout item and subitem shall have the option to set an increment, denominated as %, and can be adjusted in increments of 1.
Each workout item shall have its own countdown timer, which can be adjusted by the user in 5 sec increments.
Each workout item shall have a background colour which can be chosen by the user from a predefined scale.
The scale of background colours are dependent on the item type, where Warm-up can choose between 6 different shades of yellow and orange, Actions con choose between 12 different shades of green and red, Cool-down can choose between 4 different shades of blue.
Each workout item shall have the possibility to add and remove optional subitems, which shall have its own timer and colour choice. The colour choice is automatically set to one of the presets depending on and differing from the main items colour choice.
Each subitem shall have a checkbox, when this is checked the subitem is omitted for the last set repetition.
There shall be no restrictions on the number of items or subitems in one workout session.
Each workout session shall have an optional freetext description. This description shall be visible on the landing page if it has been entered.
Each workout item shall have options for moving it up/down in the sequence of items, duplicating it and deleting it.
Each workout session shall be displayed on the landing page with its name, description, total workout time and shall have an option for it to display a calculated pace, denominated as mm:ss/km when running the session.
If the user has not already given a name to the workout session, he shall be promted to name each session before saving it, and shall be alerted if the name has previously has been used.

**Flow Steps:**
   1. Clicking "Create New Session" shall load a predifined session containing the three items named in the Objective of this story.
   2. Each item shall be able to be edited, duplicated or deleted as required.
   3. Each item shall contain a title to be displayed during running of the session.
   4. Each item shall have its own countdown timer.
   5. It shall be possible to repeat items of the same sort (warmup, actions, cooldown) defined by a set function, stating how many times the item shall be repeated before moving on to next item. During the running of a set the text "XX of XX" shall be displayed, indicating the current progress of a set.
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
   2. The workout session starts with the first task, and at the bottom of the screen it shows which task is to follow next.
   3. A countdown timer shows the time left of the current task.
   4. A progress bar at the top of the screen shows the progress and a countdown of the entire workout session.
   5. If a speed has been set it shall be displayed below the tasks description, and if pace has been enabled it shall be displayed adjacent to the speed.
   6. If an incline has been set it shall be displayed below the speed.
   7. A pause/resume function is displayed for the session to be paused/resumed at any time.
   8. A skip function is displayed for the possibility to skip to the next task in the session.
   9. An end session function should be visible when the session is paused, enabling the user to exit the session.
   10. The session log shall be saved to local storage.

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

----

## Technical Architecture
- To be determined, possibly NextJS