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

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('imagefile', file);

  let response = await fetch('/api/outfits/upload-file', {
    method: 'POST',
    body: formData
  });
  let result = await response.json();
  console.log(result);
};

document
.querySelector(".new-outfit-form")
.addEventListener("submit", createOutfitFormHandler);

const imageFile = document.querySelector("#image");
if (imageFile) {
  imageFile.addEventListener("change", handleFiles, false);
}

function handleFiles() {
  const fileList = this.files;
  uploadFile(fileList[0]);
}