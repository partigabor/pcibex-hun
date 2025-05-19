PennController.ResetPrefix(null) // Keep this here

// IMPORTANT NOTE: when running this project, the eye-tracker will highlight
// the element that it estimates the participant is looking at
// Edit the file PennController.css in the Aesthetics folder to remove highlighting
//
// NOTE: this template will not *actually* collect eye-tracking data,
//       because the command EyeTrackerURL below points to a dummy URL in the

// Resources are hosted as ZIP files on a distant server
PreloadZip("https://files.lab.florianschwarz.net/ibexfiles/OnlyCleftsVW/Pictures.zip")
PreloadZip("https://files.lab.florianschwarz.net/ibexfiles/OnlyCleftsVW/AudioContext.zip")
PreloadZip("https://files.lab.florianschwarz.net/ibexfiles/OnlyCleftsVW/AudioTest.zip")

// If uploading data to a distant server, uncomment the line below and replace the URL
// with one that points to a PHP script that you uploaded to your webserver
// ( see https://doc.pcibex.net/how-to-guides/collecting-eyetracking-data.html#php-script )
// EyeTrackerURL("https://dummy.url/script.php")

// Welcome page: we do a first calibration here---meanwhile, the resources are preloading
newTrial(
    newText(`<p>This experiment needs to access your webcam to follow your eye movements.</p>
            <p>We will only collect data on where on this page your eyes are looking during the experiment.</p>`)
        .center()
        .print()
    ,
    newButton("I understand. Start the experiment")
        .center()
        .print()
        .wait( newEyeTracker("tracker").test.ready() )
        .remove()
    ,
    clear()
    ,
    fullscreen()
    ,
    // Start calibrating the eye-tracker, allow for up to 2 attempts
    // 50 means that calibration succeeds when 50% of the estimates match the click coordinates
    // Increase the threshold for better accuracy, but more risks of losing participants
    getEyeTracker("tracker").calibrate(50,2)
    ,
    newText(`<p>You will see the same button in the middle of the screen before each trial.</p>
             <p>Click and fixate it for 3 seconds to check that the tracker is still well calibrated.</p>
             <p>If it is, the trial will start after 3 seconds. Otherwise, you will go through calibration again.</p>`)
        .center()
        .print()
    ,
    newButton("Go to the first trial")
        .center()
        .print()
        .wait()
)

// Wait if the resources have not finished preloading by the time the tracker is calibrated
CheckPreloaded()

// Only run 24 first trials defined in the table (it's a long experiment....)
Template( "clefts.csv" , row =>
    newTrial(
        // Check/recalibrate the tracker before every trial
        newEyeTracker("tracker").calibrate(50,2)
        ,
        // 250ms delay
        newTimer(250).start().wait()
        ,
        // We will print four character-card pairs of images, one on each quadrant of the page
        // The images are 20%-width x 20%-height of the page, but each pair is contained
        // in a 40% Canvas so as to capture slightly-off gazes
        defaultImage.size("20vh", "20vh")
        ,
        newCanvas("topFemaleIA", "40vw", "40vh")
            .add( "center at 25%" , "middle at 50%" , newImage(row.pic1_top_female) )
            .add( "center at 75%" , "middle at 50%" , newImage("backTF", "back.png") )
            .print( "center at 25vw" , "middle at 25vh" )
        ,
        newCanvas("bottomFemaleIA", "40vw", "40vh")
            .add( "center at 25%" , "middle at 50%" , newImage(row.pic2_bottom_female) )
            .add( "center at 75%" , "middle at 50%" , newImage("backBF", "back.png") )
            .print( "center at 25vw" , "middle at 75vh" )
        ,
        newCanvas("topMaleIA", "40vw", "40vh")
            .add( "center at 25%" , "middle at 50%" , newImage(row.pic3_top_male) )
            .add( "center at 75%" , "middle at 50%" , newImage("backTM", "back.png") )
            .print( "center at 75vw" , "middle at 25vh" )
        ,
        newCanvas("bottomMaleIA", "40vw", "40vh")
            .add( "center at 25%" , "middle at 50%" , newImage(row.pic4_bottom_male) )
            .add( "center at 75%" , "middle at 50%" , newImage("backBM", "back.png") )
            .print( "center at 75vw" , "middle at 75vh" )
        ,
        newAudio(row.context_soundfile).play().wait()
        ,
        // Remove the face-down cards
        getImage("backTF").remove(),getImage("backBF").remove(),getImage("backTM").remove(),getImage("backBM").remove()
        ,
        // Show the face-up cards
        newImage(row.pic1_suit).print( "center at 75%" , "middle at 50%" , getCanvas("topFemaleIA") ),
        newImage(row.pic2_suit).print( "center at 75%" , "middle at 50%" , getCanvas("bottomFemaleIA") ),
        newImage(row.pic3_suit).print( "center at 75%" , "middle at 50%" , getCanvas("topMaleIA") ),
        newImage(row.pic4_suit).print( "center at 75%" , "middle at 50%" , getCanvas("bottomMaleIA") )
        ,
        getEyeTracker("tracker")
            .add(   // We track the Canvas elements   
                getCanvas("topFemaleIA"),
                getCanvas("bottomFemaleIA"),
                getCanvas("topMaleIA"),
                getCanvas("bottomMaleIA") 
            )
            .log()  // If this line is missing, the eye-tracking data won't be sent to the server
            .start()
        ,
        newTimer(500)
            .start()
            .wait()
        ,
        newAudio("test", row.test_soundfile)
            .log()
            .play()
        ,
        // Wait for a click on one of the four Canvas elements
        newSelector("answer")
            .add(
                getCanvas("topFemaleIA"),
                getCanvas("bottomFemaleIA"),
                getCanvas("topMaleIA"),
                getCanvas("bottomMaleIA") 
            )
            .once()
            .log()
            .wait()
        ,
        // Stop now to prevent collecting unnecessary data
        getEyeTracker("tracker")
            .stop()
        ,
        // Make sure playback is over before moving on
        getAudio("test").wait("first")
        ,
        newTimer(250).start().wait()
    )
)

SendResults()

newTrial(
    exitFullscreen()
    ,
    newText("The is the end of the experiment, you can now close this window. Thank you!")
        .center()
        .print()
    ,
    newButton("waitforever").wait() // Not printed: wait on this page forever
)
.setOption("countsForProgressBar",false)