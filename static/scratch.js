function stylizer(){
    // query the checkboxes for user choices
    let checkboxes = document.querySelectorAll('input[type="checkbox"]');
    // JS doesn't have dictionaries, but it does have objects, and that'll do!
    let results = {};
    // JS doesn't have python's 'for x in array', but FreeCodeCamp taught me this way to
    // loop through the contents of an object and do something to it with arrow functions
    checkboxes.forEach(checkbox => { results[checkbox.name] = checkbox.checked; });
    // console.log(results);

    // get our variables from the user's input
    // start with the word at issue
    let input_string = document.querySelector("#user_input").value

    if (results["caps"] == true){
        input_string = input_string.toUpperCase();
    }
    if (results["spaces"] == false){
        input_string = input_string.replace(/\s/g, '');
    }

    /*
    I think the approach for any selected option(s) is to first create a 2d array of the input
    string, and then begin swapping spaces for letters as the user clicks radio buttons.
    trying to create shapes by just tracking " " is going to be a collosal headache
    especially with multiple sides running and duplicate characters adding to the mix
    */

    // input data will manipulable in array format
    let input_string_array = input_string.split("");


    // reversing now and storing in a separate array is going to be easier than calling functions ad hoc
    let reversed_input_string_array = input_string.split("").reverse();

    // create 2D array in JS; fill the array with blank spaces
    let two_d_array = new Array (input_string_array.length);
    for (let i = 0; i < input_string_array.length; i++){
        // y axis requires twice the width of X axis for S P A C I N G;
        // endash html code because for whatever reason standard white space
        // characters get truncated on the final display, but only on 'right' side
        two_d_array[i] = new Array (input_string_array.length * 2).fill("&#8194");
    }

    // top
    if (results["top"] == true){
        for (let i = 0, j = 0; i < input_string_array.length * 2; i++){
            // only even indicies will get the input characters; Hi! at [0,2,4] becomes H I !
            if (i % 2 == 0){
                two_d_array[0][i] = input_string_array[j];
                j++;
            }
        }
    }

    // left
    if (results["left"] == true){
        for (let i = 0; i < input_string_array.length; i++){
          two_d_array[i][0] = input_string_array[i];
        }
    }

    // TODO right
    if (results["right"] == true){
        for (let i = 0; i < input_string_array.length; i++){
            // length - 1 because arrays are 0-indexed
            two_d_array[i][(input_string_array.length - 1) * 2] = reversed_input_string_array[i];
        }
    }

    // bottom
    if (results["bottom"] == true){
        for (let i = 0, j = 0; i < input_string_array.length * 2; i++){
            // length - 1 because arrays are 0-indexed; mod math because x axis is S P A C E D
            if (i % 2 == 0){
                two_d_array[two_d_array.length - 1][i] = reversed_input_string_array[j];
                j++;
            }
        }
    }

    // backslash
    if (results["backslash"] == true){
        for (let i = 0; i < input_string_array.length; i++){
            // length - 1 because arrays are 0-indexed
            two_d_array[i][i * 2] = input_string_array[i];
        }
    }

    // forward slash
    if (results["forward"] == true){
        for (let i = 0; i < input_string_array.length; i++){
            // length - 1 because arrays are 0-indexed
            two_d_array[i][(two_d_array.length - 1 - i) * 2] = reversed_input_string_array[i];
        }
    }

    // hourglass
    if (results["top"] == true && results["bottom"] == true && results["forward"] == true && results["backslash"] == true){
        // left side
        if (results["backslash"] == true){
            for (let i = 0; i < input_string_array.length; i++){
                // top half of hourglass diagonal
                if (i < input_string_array.length / 2){
                    // length - 1 because arrays are 0-indexed
                    two_d_array[i][i * 2] = input_string_array[i];
                }
                // bottom half of hourglass diagonal
                else{
                    two_d_array[i][(input_string_array.length - 1 - i) * 2] = input_string_array[i];
                }
            }
        }

        // right side
        if (results["forward"] == true){
            for (let i = 0; i < input_string_array.length; i++){
                // top half of hourglass diagonal
                if (i < input_string_array.length / 2){
                    // length - 1 because arrays are 0-indexed
                    two_d_array[i][(two_d_array.length - 1 - i) * 2] = reversed_input_string_array[i];
                }
                // bottom half of hourglass diagonal
                else{
                    two_d_array[i][i * 2] = reversed_input_string_array[i];
                }
            }
        }
    }

    // I didn't like the inclusion of the entire blank 2D array when only 'top' is selected.
    // This is an interim solution pending regex implementation below.  "It's OK, I'm a developer."
    if (results["top"] && !results["bottom"] && !results["left"] && !results["right"] && !results["forward"] && !results["backslash"]){
        output_string = two_d_array[0].join("");

        // there's still an EOL \n lurking in the resulting strikng.
        output_string = output_string.replace(/\n/g, "");
        // output_string.trimEnd();
        // console.log(output_string);
    }

    else {
        // stitch the array into a string
        // mapping 2d array to string approach from https://stackoverflow.com/questions/70748506/
        output_string = two_d_array.map(row => row.join("")).join("\n");
    }

    // TODO add regex that removes all whitespace after last letter; fixes issue with multiple
    // when only 'top' is selected

    // I'm using the en space, \u2002, to build grid. This should catch it, but it doesn't.
    // output_string = output_string.replace(/\s+$/, "");
    // console.log(output_string);

    // finally, print to screen
    document.querySelector("#output").innerHTML = output_string;
}

// copy to clipboard via new work-in-progress HTML5 standardized function documentation
// didn't work, so manual JS solution from https://stackoverflow.com/questions/49247129/
function copyToClipboard(id) {
    // goes to #output
    var from = document.getElementById(id);
    // creates a variable in prep to store #output
    var range = document.createRange();
    // I don't get what's happening here all that clearly. I think it's a preventative measure
    // to clear out anything that may have been selected in previous use of the window?
    window.getSelection().removeAllRanges();
    // I know this is picking off the #output node from the DOM
    range.selectNode(from);
    // and adding it to the rangeless window created above
    window.getSelection().addRange(range);
    // executing the copy command, and i guess browser just knows to
    // copy contents of window to clipboard by default? This apparently
    // being reinvented in new HTML5 standards in progress.
    document.execCommand('copy');
    // See above
    window.getSelection().removeAllRanges();
 }

/*
Failed Implementation; no browser ever liked ClipboardItem, despite VSCode seeing it as a special term
// adapted from https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/write
function copyAsImage(id)
{
    let x = document.getElementById(id);
    html2canvas(x).then((canvas) => {
        canvas.toBlob((blob) =>
        {
            let data = [new ClipboardItem({ [blob.type]: blob })];
            navigator.clipboard.write(data);
            }
        );
    });
}
*/

// TODO get the canvas to stop being wider than the grid
function displayAsImage(id){
    // found html2canvas on github, implementation help from
    // https://www.geeksforgeeks.org/how-to-take-screenshot-of-a-div-using-javascript/
    // Use the html2canvas function to take a screenshot, append to #photo div

    let x = document.getElementById(id);
    html2canvas(x).then((canvas) => {
        document.getElementById('photo').appendChild(canvas);
    });
}

/*
Failed implementation
function copyAsImage(id){
    const x = document.getElementById(id);
    const response = html2canvas(x).then((canvas) => {
        navigator.clipboard.write(canvas);
    //navigator.clipboard.write([new ClipboardItem({'image/png':response})]);
    })
}
*/

/*
Failed implementation
// https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/write
function copyAsImage(id) {
    const x = document.getElementById(id);
    const response = html2canvas(x).then((canvas) => {
        navigator.clipboard.write(canvas);
    })
    const type = "img/png";
    const blob = new Blob([response], { type });
    const data = [new ClipboardItem({ [type]: blob })];

    navigator.clipboard.write(data).then(
      () => {
        //* success
      },
      () => {
        // failure
      }
    );
  }
*/

function share(id){
    // share button for supported (generally mobile) platforms & browsers; it's just slick looking
    // but there could not be more distinct implementations to copying and sharing if they tried!
    // help from https://stackoverflow.com/questions/11813806/ and
    // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share

    // TODO Get Chrome to stop throwing error codes when, in fact, the feature is working properly!
    // TODO Get Firefox to implement properly when the appropriate about:config setting is enabled
    // TODO Get Safari desktop to stop throwing error codes after successful sharing

    // check for supported platforms & browsers
    if (!navigator.canShare){
        // let users know if their computer doesn't support sharing
        document.querySelector('#share_message').innerHTML = "Your browser doesn't support the Web Share API.";
        // erase message after two seconds
        setTimeout(() => {
            document.querySelector('#share_message').innerHTML = " ";
          }, 2000);
    }

    // assuming browser support...
    else{
        const resultPara = document.querySelector('#share_message');
        const share_text = document.querySelector('#output');

        // Get the text content of the element
        const outputText = share_text.textContent;

        let shareData = {
            title: 'A E S T H E T I C',
            text: share_text
        }
        console.log(shareData);
        navigator.share(shareData)
            .then(() => resultPara.textContent = 'Text shared successfully')
            .catch((e) => {
                // ...but it's a reubttable presumption of support
                resultPara.textContent = e;
                setTimeout(() => {
                    document.querySelector('#share_message').innerHTML = " ";
                    }, 2000);
            });
    }
}

document.addEventListener("keyup", stylizer);
document.addEventListener("paste", stylizer);