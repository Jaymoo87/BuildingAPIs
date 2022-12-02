// chirp button variable
let chirpButton = $("#chirpButton");

//grabbing the chirps

let fetchChirps = () => {
  $.get("/api/chirps", (data, status) => {
    delete data.nextid;
    let arrayOfChirps = Object.keys(data).map((chirpID) => {
      let chirp = data[chirpID];
      chirp.id = chirpID;
      return chirp;
    });
    $("#timeline").empty();
    console.log(arrayOfChirps);
    arrayOfChirps.forEach((chirp) => {
      // es6 shorthand for chirp.user, chirp.text, and chirp.id
      const { name, message, id } = chirp;

      //ChirpDiv defines an html block for the modal popup before the chirp post is completed.
      //used a standalone html file to start this out.
      /// this is fucking terrifying, if can avoid doing it this way I will in the future

      let chirpDiv = `
      <div class="row justify-content-center">
      <div class="card w-75 text-center d-flex m-3 shadow justify-content-center border border-info rounded">
      <div class="card-body justify-content-center">
      <h5 class="card-title text-center">${name}</h5>
      <p class="card-text">${message}</p>
      <div calss= "justify-content-around">
      <button data-id=${id}  type= "button" id="editChirpButton" class="btn btn-primary " data-toggle="modal" data-target="#editModal${id}">Edit</button>
      <button data-id=${id} id="deleteChirpButton" class="btn btn-primary" onclick="deleteChirp(${id})">X</button>
     </div> 
     </div>
      </div>
      </div>
      <div class="modal fade" id="editModal${id}" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdrop" aria-hidden="true">
      <div class="modal-dialog">
      <div class="modal-content">
      <div class="modal-header">
      <h5 class="modal-title" id="staticBackdrop">Edit Chirp</h5>
      <button type="button" class="close" data-dismiss="modal" aria-label="close">
      <span aria-hidden="true">&times;</span>
      </button>
      </div>
      <textarea class="modal-body form-control" id="textEdit${id}">
      ${message}
      </textarea>
      <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
      <button type="button" class="btn btn-primary" onclick="editChirp(${id}, '${name}', $('#textEdit${id}').val())" data-dismiss="modal">Submit Edit</button>
        </div>
        </div>
        </div>
        </div>
        `;
      /// sets up the new chirp on the arrayOfChirps displayed on the timeline
      $("#timeline").append(chirpDiv);
    });
  });
};
//delete chirps --> identify url by id and define action "type"
let deleteChirp = (id) => {
  $.ajax({
    url: `/api/chirps/${id}`,
    type: "DELETE",
    //success sends a function to empty the timeline div and return all but the deleted chirp
    success: function () {
      $("#timeline").empty();
      fetchChirps();
    },
  });
};
fetchChirps();

//edit chirp --->define the parameters of the chirp object and update the timeline
let editChirp = (id, name, message) => {
  let chirp = {
    name,
    message,
  };
  // .ajax jQuery to find the chirp by id, PUT (edit) action "type", identify the data type and config the headers for JSON strings
  $.ajax({
    url: `/api/chirps/${id}`,
    type: "PUT",

    data: JSON.stringify(chirp),
    headers: { "content-type": "application/json" },
    //success sends a function to empty the timeline div, reload the page, and replenish the newly edited arrayOfChirps
    success: function () {
      $("#timeLine").empty();
      location.reload();
      fetchChirps();
    },
  });
};

chirpButton.click(() => {
  location.reload();
  let chirpText = $("#chirpText").val();
  let userName = $("#userText").val();
  let chirp = {
    name: userName,
    message: chirpText,
  };
  $.post(`/api/chirps/`, chirp).then(() => {
    $("#timeline").empty;
    fetchChirps();
  });
});

// editButton.click("show.bs.modal", () => {
//   let chirpText = $("#chirpText").val();
//   let userName = $("#userText").val();
//   let chirp = {
//     name: userName,
//     message: chirpText,
//   };
// });
