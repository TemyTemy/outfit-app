async function createOutfitFormHandler(event) {
  event.preventDefault();

  const outfitName = document.querySelector("#outfit-name").value.trim();
  const price = document.querySelector("#price").value.trim();
  const brand = document.querySelector("#brand").value.trim();
  const location = document.querySelector("#location").value.trim();
  const occasion = document.querySelector("#occasion").value.trim();
  const colour = document.querySelector("#colour").value.trim();
  const gender = document.querySelector("#gender").value.trim();
  const image = document.querySelector("#image").value.trim();

  const cl = new cloudinary.Cloudinary({cloud_name: "do5244w1d", secure: true});


  if (outfitName && price && brand && location && occasion && colour && gender && image) {
    const response = await fetch("/api/outfits/addoutfit", {
      method: "POST",
      body: JSON.stringify({ outfitName, price, brand, location, occasion, colour, gender, image }),
      headers: { "Content-Type": "application/json" },
    });
    console.log(response);
    if (response.ok) {
      document.location.replace("/dashboard");
    } else {
      alert(response.statusText, "Failed to upload outfit");
    }
  }
};

document
.querySelector(".new-outfit-form")
.addEventListener("submit", createOutfitFormHandler);

image.addEventListener("change", handleFiles, false);
function handleFiles() {
  const fileList = this.files;
  const reader = new FileReader();
  reader.addEventListener('load', (event) => {
    const result = event.target.result;
    image.value= result;
  });
  reader.readAsDataURL(fileList[0]);
}

// SDK initialization

var imagekit = new ImageKit({
  publicKey : "public_0eCOz3eR7RNLnYKED+fFf9A/2/Y=",
  urlEndpoint : "https://ik.imagekit.io/poseit21"
});

// URL generation
var imageURL = imagekit.url({
  path : "/default-image.jpg",
  transformation : [{
      "height" : "300",
      "width" : "400"
  }]
});

// Upload function internally uses the ImageKit.io javascript SDK
function upload(data) {
  var file = document.getElementById("file1");
  imagekit.upload({
      file : file.files[0],
      fileName : "abc1.jpg",
      tags : ["tag1"]
  }, function(err, result) {
      console.log(arguments);
      console.log(imagekit.url({
          src: result.url,
          transformation : [{ height: 300, width: 400}]
      }));
  })
}