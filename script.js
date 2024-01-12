// SUMMARY :
//The code fetches the HTML content of a specific URL, parses it, extracts all anchor tags (<a>), and filters out those with href ending in ".mp3".
//It then returns an array (songs) containing the URLs of MP3 files found in the HTML content and main fn is used to handle promise retyrned by getSongs asysnc fn

/* FUNCTIONS : secondsToMinutesSeconds FN , getSongs FN , playMusic FN , main FN
 INSIDE MAIN FUNCTION :
1.GET LIST OF ALL THE SONGS
2.ATTACH AN EVENT LISTENER TO EACH SONG
3. ATTACH AN EVENT LISTENER AND SVG TO PLAY,NEXT AND PREVIOUS
4.LISTEN FOR TIME UPDATE EVENT
5.ADD AN EVENT LISTENER TO SEEK BAR 
6.ADD AN EVENT LISTENER FOR HAMBURGER(mtlb uspe click krke left panel open hojaye)
7.ADD AN EVENT LISTENER FOR close button(mtlb uspe click krke left panel close hojaye)
8.ADD AN EVENT LISTENER TO PREVIOUS
9. ADD AN EVENT LISTENER TO NEXT */
//gaane ki audio is in our vs code and uska naam html se extract hoga iske so we have to link both of them /songs/ vali chiz isme help krti h vo correct path de deti hai audio file ko play hone ka

let currentSong = new Audio();
let songs;
let currfolder;
//1.
//takes a number of seconds as an argument and converts it into a formatted string representing minutes and seconds in 'mm:ss' format
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00"; //Return '00:00' if the input is not valid
  }
  //Calculate minutes and seconds from the input seconds
  const mins = Math.floor(seconds / 60); //CALCULATE MINUTES
  const secs = Math.round(seconds % 60); //Calculate remaining seconds and round it ,calculates the remaining seconds after extracting the minutes and rounds it using Math.round
  const formattedMins = String(mins).padStart(2, "0"); // Format minutes to have leading zeros if needed
  const formattedSecs = String(secs).padStart(2, "0"); //Format seconds to have leading zeros if needed,converts the minutes to a string and ensures it always has at least two characters by adding leading zeros using padStart if needed

  return `${formattedMins}:${formattedSecs}`;
}

//2.
//this fn returns us all songs from song directory since we are not using any backend we are doing this
//so ham ideally server se leke aenge sare songs APIs ka use krke but here we are making  aclient side project for learnig purposes
//making async http request using fetch api and then handling the response
async function getSongs(folder) {
  //this is an async fn i.e it will always return a promise
  currfolder = folder;
 // console.log(currfolder);
  let a = await fetch(`${folder}/`); //using fetch fn an http GET request is made to this url and the keyword await here pauses execution of fn until the romise returned bythis fn resolves i.e when http req is complete and response is available
  let response = await a.text(); //a has response body ,text fn converts the response body to text and await is used to ..
  //The obtained HTML content of the page is stored in the response variable
  //response has output text
  //then we need to parse this dom to get our songs
  let div = document.createElement("div"); //This line creates a new <div> element
  div.innerHTML = response; // HTML content obtained from the response is assigned to the innerHTML property of the previously created <div>. This action effectively parses the HTML string into DOM elements inside this <div>
  let as = div.getElementsByTagName("a"); //It selects all <a> elements within the parsed HTML content and stores them in the as variable

  songs = []; //empty array is initialized to store the URLs of MP3 files found in the a tags
  //1. It iterates through each <a> element (as collection).
  //2. For each anchor tag, it checks if the href attribute ends with ".mp3".
  //3. If the condition is true, it pushes the URL (href) of the MP3 file into the songs array.
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  //console.log('Songs in getSongs function:', songs);
  //SHOW ALL THE SONGS IN THE PLAYLIST
  //ab jab bhi sare songa aajaenge to unko songlist ke ul mein daldo
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li> <img class="invert" src="music.svg" alt="" >
    <div class="info">
      <div>${song.replaceAll("%20", " ")}</div>
      <div> Abha </div>
    </div>
      <div class="playNow">
        <span>Play Now</span>
        <img class="invert" src="play.svg" alt="" >
      </div> </li>`;
  }

  //B.
  //ATTACH AN EVENT LISTENER TO EACH SONG
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      //console.log(e.querySelector(".info").firstElementChild.innerHTML);

      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
  return songs;
}

//3.playMusic function is responsible for playing a song and updating the UI elements related to song information and time
//fn takes two parameters: track (which is the URL or identifier of the song to play) and pause (which is an optional boolean flag
const playMusic = (track, pause = false) => {
  currentSong.src = `/${currfolder}/` + track; //Sets the src attribute of the currentSong audio element to the path of the provided track. This prepares the audio element to play the selected track
  //This is a concatenation operation where "/songs/" is a base path or directory where the audio files are assumed to be stored. track is a parameter or variable holding the filename or identifier of the audio file to be played. By appending track to "/songs/", it creates a complete path to the specific audio file
  //This action effectively loads the audio file specified by track into the currentSong element, preparing it for playback
  if (!pause) {
    currentSong.play();
    play.src = "pause.svg"; //Updates the src attribute of an HTML element with class "play" to display the "pause.svg" icon
  }

  document.querySelector(".songinfo").innerHTML = decodeURI(track); // Updates the content of an HTML element with the class "songinfo" to display the name of the track by using decodeURI to handle any URI-encoded characters
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00"; //Sets the content of an HTML element with the class "songtime" to display default time "00:00/00:00". This might be the placeholder for displaying the current playback time and total duration of the song
};
  
async function displayAlbums(){
  const cardContainer = document.querySelector('.cardContainer');

  const a = await fetch(`/songs/`);
  const response = await a.text();
  const div = document.createElement("div");
  div.innerHTML = response;

  const listItems = div.querySelectorAll('li > a');
  listItems.forEach(async (item) => {
    const href = item.href;
    const parts = href.split('/');
    const folderIndex = parts.indexOf('songs');

    if (folderIndex !== -1 && folderIndex < parts.length - 1) {
      const folder = parts[folderIndex + 1];

      const folderResponse = await fetch(`/songs/${folder}/info.json`);
      const response = await folderResponse.json();

      const card = document.createElement("div");
      card.dataset.folder = folder;
      card.classList.add("card");

      card.innerHTML = `
        <div class="play">
          <svg width="30" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="#000000" fill="#000" stroke-width="1.5" stroke-linejoin="round"/>
          </svg>
        </div>
        <img src="/songs/${folder}/cover.jpg" alt="Sleep"/>
        <h2>${response.title}</h2>
        <p>${response.description}</p>
      `;
      cardContainer.appendChild(card);
     // console.log(card);
    }
    
  });
  //LOAD THE PLAYLIST WHENEVER CARD IS CLICKED
  document.addEventListener('click', async function (event) {
    const card = event.target.closest('.card');
    if (card) {
      const folder = card.dataset.folder;
      console.log(folder);
      songs = await getSongs(`songs/${folder}`);
      playMusic(songs[0]);
    }
  });
  //not working for dynami content
  // Array.from(document.getElementsByClassName("card")).forEach((e) => {
  //   console.log(e);
  //   e.addEventListener("click", async (item) => {
      
  //     console.log(item.currentTarget.dataset.folder); 
    
  //   console.log(item.dataset);
  //     songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
  //   });
  // });
  
}
//not loading cards dynamically
// let a = await fetch(`/songs/`);
// let response = await a.text();
// let div= document.createElement("div");
// console.log(div);
// div.innerHTML=response;

// let anchors = div.querySelectorAll('a[href^="/songs/"]');
// let cardContainer = document.querySelector(".cardContainer");


// Array.from(anchors).forEach(async e => {
//   let folder = e.href.split("/").slice(-1)[0]; 
//   //get the metadata of the folder
//   let a = await fetch(`/songs/${folder}/info.json`);
// let response = await a.json();
// console.log(response);

// const newCard = document.createElement('div');
// newCard.setAttribute('data-folder', 'cs');
// newCard.classList.add('card');
// newCard.innerHTML = `<div data-folder="cs" class="card">
// <div  class="play">
//   <svg
//     width="30"
//     height="80"
//     viewBox="0 0 24 24"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path
//       d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
//       stroke="#000000"
//       fill="#000"
//       stroke-width="1.5"
//       stroke-linejoin="round"
//     />
//   </svg>
// </div>

// <img
//   src="/songs/${folder}/cover.jpg"
//   alt="Sleep"
// />
// <h2>${response.title}</h2>
// <p>${response.description}</p>
// </div>` ;
// cardContainer.appendChild(newCard);
// });

//4.
// Inside main, the getSongs function is called using await to retrieve the array of MP3 URLs. It waits for the getSongs function to complete and returns the songs array.
async function main() {
  //A.
  //GET LIST OF ALL THE SONGS
  await getSongs("songs/ncs");
  playMusic(songs[0], true);
  // console.log(songs);// array of MP3 URLs obtained from getSongs is logged to the console.

  //DISPLAY ALL THE ALBUMS ON THE PAGE
  displayAlbums();
  //C.
  //ATTACH AN EVENT LISTENER TO PLAY,NEXT AND PREVIOUS
  play.addEventListener("click", () => {
    console.log(currentSong)
    if (currentSong.paused) {
      currentSong.play();
      play.src = "pause.svg";
    } else {
      currentSong.pause();
      play.src = "play.svg";
    }
  });
  //D.
  //LISTEN FOR TIME UPDATE EVENT
  currentSong.addEventListener("timeupdate", () => {
    //  console.log(currentSong.currentTime,currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )} / ${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });
  //E.
  //ADD AN EVENT LISTENER TO SEEK BAR (for moving the seek bar by clicking)
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    //ab we want ki jha bhi ham seekbar ko click kren vha time bhi change ho song ka uske according
    //litna percent song aage gya h usko duration se * krdenge aur /100 taki seconds miljaye percent nahi
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });
  //F.
  // ADD AN EVENT LISTENER FOR HAMBURGER(mtlb uspe click krke left panel open hojaye)
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });
  //G.
  // ADD AN EVENT LISTENER FOR close button(mtlb uspe click krke left panel close hojaye)
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });
  //H.
  //ADD AN EVENT LISTENER TO PREVIOUS
  previous.addEventListener("click", () => {
    console.log("Previous click");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]); //current song ka index pta lgao songs array mein

    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });
  //I.
  //ADD AN EVENT LISTENER TO NEXT
  next.addEventListener("click", () => {
    console.log("Next click"); //for debugging ive put
    console.log(currentSong);//audio tag vala element
    //console.log(currentSong.src);///songs/Carlos_Estella_-_Happy_Inspiring_Strings.mp3
    //console.log(currentSong.src.split("/"));//['http:', '', '127.0.0.1:5500', 'songs', 'Carlos_Estella_-_Happy_Inspiring_Strings.mp3]
    //.slice(-1): The slice() method extracts a portion of the array. When using -1 as an argument, it means to extract the last element of the array.
    //[0]: Finally, accessing the first (and only) element of the sliced array to get the last portion of the URL after the last /

    //   console.log('Songs:', songs); // Check the content of the songs array
    // console.log('Current Song:', currentSong.src); // Check the value of currentSong.src
    // let splitSrc = currentSong.src.split("/");
    // console.log('Split Source:', splitSrc); // Check the split array
    // let lastPart = splitSrc.slice(-1)[0];
    // console.log('Last Part:', lastPart); // Check the last part of the split array
    // let index = songs.indexOf(lastPart);
    // console.log('Index:', index); // Check the index value

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]); //current song ka index pta lgao songs array mein
    //console.log(currentSong.src.split("/").slice(-1)[0]);//Carlos_Estella_-_Happy_Inspiring_Strings.mp3
   // console.log(songs, index);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
    
  });

  // ADD AN EVENT LISTENER TO VOLUME(range ke andr jo 1st input hoga usko sunlo)
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
      console.log("Setting volume to ", e.target.value, "/ 100");
      currentSong.volume = parseInt(e.target.value) / 100;
    });
}

//ADD AN EVENT LISTENER TO MUTE THE TRACK
document.querySelector(".volume>img").addEventListener("click",e=>{
  // console.log(e.target);
  // console.log("changing",e.target.src);
  if(e.target.src.includes("volume.svg")){
    e.target.src = e.target.src.replace("volume.svg","mute.svg");
    currentSong.volume = 0;
    document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
  }else{
    e.target.src = e.target.src.replace("mute.svg","volume.svg");
    currentSong.volume = 0.10;
    document.querySelector(".range").getElementsByTagName("input")[0].value = 15;
  }
})
main();

/* PLAY THE 1ST SONG
    var audio = new Audio(songs[0]);
    audio.play();

    audio.addEventListener("ontimeupdate",()=>{
        let duration = audio.duration;
        console.log(audio.duration,audio.currentSrc,audio.currentTime);
    });

document.getElementById('playButton').addEventListener('click', function() {
    const audio = new Audio(songs[0]);
    audio.play()
      .then(() => {
        console.log('Audio playback started successfully');
      })
      .catch(error => {
        console.error('Error playing audio:', error);
      });
  }); */

// //(gpt) NEED OF MAIN FUNCTION --------------
// // (becoz agr sirf getsongs fn ko call krdenge to promise pending aarha h console mein)
// In JavaScript, when you execute asynchronous code without wrapping it in an immediately invoked `async` function or using another asynchronous context, the Promise returned by an async function will remain pending if not handled properly. This is because the execution doesn’t wait for the asynchronous operation to complete before moving on to the next line.

// For instance, if you call an async function directly without using `await` or `then` to handle its returned Promise, it won't resolve automatically. Instead, it will remain in the pending state. Here’s an example:

// ```javascript
// // Async function without awaiting its completion
// async function getSongs() {
//   // ... (fetching and processing data)
//   return data;
// }

// getSongs(); // This call won't resolve the promise automatically
// ```

// In this scenario, the `getSongs()` function is invoked, but because there's no awaiting or handling of its returned Promise (`getSongs()` returns a Promise due to the `async` keyword), the promise will remain pending.

// To properly handle the Promise returned by an async function, you need to use `await` or `.then()` to either directly handle the resolved value or chain further async operations. For example:

// ```javascript
// // Handling the promise returned by an async function
// async function handleSongs() {
//   const songs = await getSongs(); // Await the completion of the async operation
//   console.log(songs); // Log or further process the resolved value
// }

// handleSongs(); This properly handles the Promise returned by getSongs()