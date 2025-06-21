
/////////////////////////////////////////////////////////////////////////////////////////
// // Experiment with audio
// Template("experiment_data.csv", row => // Trial structure using data from the CSV file
//     newTrial( "experiment_trial",
    
//         // 0. Check/recalibrate the tracker before every trial
//         newEyeTracker("tracker").calibrate(50,2),
        
//         // 250ms delay
//         newTimer(250).start().wait(),
        
//         // // Optional: A brief fixation point or pause before the trial starts
//         // newText("fixation_cross", "+").css("font-size", "1em").center().print(),
//         // newTimer("fixation_duration", 500).start().wait(), // Show fixation for 500ms
//         // getText("fixation_cross").remove(), // Remove fixation cross
        
//         // 1. Play the audio
//         newAudio("sentence_audio", row.audio_file)
//             .log().play().wait(), // Log when audio playback starts and ends; wait for the audio to finish playing before showing images
            
//         // 2. Display the images (left and right) AFTER audio has finished
//         // Images are placed on canvases, which serve as clickable regions.
//         // defaultImage.size("20vh", "20vh"),
        
//         newCanvas("left_image_canvas", "45vw", "70vh") // Canvas for the left image
//             .add("center at 50%", "middle at 50%", newImage("left_image_stimulus", row.image_left).size("90%", "90%"))
//             .print("center at 25vw", "middle at 50vh") // Position canvas on the left
//         ,
//         newCanvas("right_image_canvas", "45vw", "70vh") // Canvas for the right image
//             .add("center at 50%", "middle at 50%", newImage("right_image_stimulus", row.image_right).size("90%", "90%"))
//             .print("center at 75vw", "middle at 50vh") // Position canvas on the right
//         ,
        
//         // Activate tracker
//         getEyeTracker("tracker")
//             .add(   // We track the Canvas elements   
//                 getCanvas("left_image_canvas"),
//                 getCanvas("right_image_canvas"),
//             )
//             .log()  // If this line is missing, the eye-tracking data won't be sent to the server
//             .start(),

//         newTimer(500).start().wait(),
        
//         // 3. Collect participant's choice by clicking on one of the images
//         newSelector("choice_selector")
//             .add(
//                 getCanvas("left_image_canvas"), 
//                 getCanvas("right_image_canvas") ) // Define clickable elements
//             .once() // Participant can only click once
//             .log() // Log which element was selected (its ID) and the reaction time //"all"?
//             .wait(), // Wait for a selection (click)
        
//         // Stop tracker to prevent collecting unnecessary data
//         getEyeTracker("tracker").stop(),
        
//         // Make sure playback is over before moving on
//         // getAudio("test").wait("first"),
//         // newTimer(250).start().wait(),
//         newTimer("inter_trial_interval", 750).start().wait() // Brief pause (750ms) before the next trial
//     )
//     // Log additional trial information from the CSV file to the results
//     // .log("item_number", row.item_number)
//     // .log("condition", row.condition)
//     // .log("audio_file", row.audio_file)
//     // .log("image_left", row.image_left)
//     // .log("image_right", row.image_right)
//     // .log("expected_choice_image", row.expected_choice_image)

//     // Log these global variables for each trial result line as well (if needed, e.g., for counterbalancing from URL)
//     // .log( "participant_id" , PennController.GetURLParameter("id") )
//
