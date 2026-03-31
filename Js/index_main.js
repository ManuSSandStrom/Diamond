$(document).ready(function(){
    $('.Product-Slider').slick({
        dots: false,
        arrows: false,
        infinite: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 2000,
        slidesToShow: 1,
        slidesToScroll: 1
    });
    $('.Customer-Slider').slick({
        dots: false,
        arrows: false,
        infinite: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 2000,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2
                }
            }
        ]
        
    });
});


let Id = null;
let data = null;
let phone = null;


async function loadData() {
  const response = await fetch("https://goodconnext.com/card/CrestviewRealtors/data.json");
//const response = await fetch("./data.json");
  data = await response.json();
}

async function main() {
  await loadData();

  const p = data;
  Id = p.firstname;        
  phone = (p.country + p.phone).replace(/\s+/g, '').replace(/\+/g, '')

  // ===== SET VALUES IN HTML =====
  document.getElementById("firstname").textContent = p.firstname;
  document.getElementById("lastname").textContent = p.lastname;
  document.getElementById("firstnamePreview").textContent = p.firstname;
  document.getElementById("lastnamePreview").textContent = p.lastname;
  document.getElementById("role").textContent = p.role;
  document.getElementById("rolePreview").textContent = p.role;

  // ===== Phone =====
  document.getElementById("country").textContent = p.country;
  document.getElementById("phone").textContent = p.phone;
  document.getElementById("phoneLink").href = `tel:+${phone}`;

  // ===== Email =====
  document.getElementById("email").textContent = p.email;
  document.getElementById("emailLink").href = `mailto:${p.email}`;

  // ===== WhatsApp =====
  if (p.whatsapp) {
    document.getElementById("whatsappLink").href = p.whatsapp;
  }else{
    document.getElementById("whatsapp").style.display = 'none';
  }
  // ===== LinkedIn =====
  if (p.linkedin) {
    document.getElementById("linkedinLink").href = p.linkedin;
  }
  else{
    document.getElementById("linkedin").style.display = 'none';
  }

  generateQrCodePreview(Id);
  imgGenerator();
}

main();



// function showVideo(num) {
//   const videos = document.querySelectorAll(".realestatemain1, .realestatemain2");
//   const tabs = document.querySelectorAll(".tab");

//   videos.forEach(video => {
//     video.pause();
//     video.classList.remove("active");
//     video.currentTime = 0;
//   });

//   tabs.forEach(tab => tab.classList.remove("active"));
//   const selectedVideo = qs("#video" + num);
//   selectedVideo.classList.add("active");
//   selectedVideo.play();

//   tabs[num - 1].classList.add("active");
// }


// function showVideo(num) {
//     const tabs = document.querySelectorAll(".tab");
//     const section1 = document.querySelector(".realestatemain1");
//     const section2 = document.querySelector(".realestatemain2");
//     const videos = document.querySelectorAll(".video");

//     videos.forEach(video => {
//         video.pause();
//         video.classList.remove("active");
//         video.currentTime = 0;
//     });

//     // Remove active class from all tabs
//     tabs.forEach(tab => tab.classList.remove("active"));
//     const selectedVideo = document.getElementById("video" + num);
//     selectedVideo.classList.add("active");
//     selectedVideo.play();

//     // Toggle sections (tabs remain visible)
//     if (num === 1) {
//         section1.style.display = "block";
//         section2.style.display = "none";
//     } else {
//         section1.style.display = "none";
//         section2.style.display = "block";
//     }

//     // Activate clicked tab
//     tabs[num - 1].classList.add("active");
// }


function generateQrCodePreview(Id) {
    if (!Id) return;
    let basePath = window.location.origin + window.location.pathname;
    if (basePath.endsWith("index.html")) {
        basePath = basePath.replace(/index\.html$/, "");
    }
    const vcfUrl = `${basePath}?@=${Id}`;
    console.log("Generating QR for URL:", vcfUrl);
    QRCode.toString(vcfUrl, { type: "svg", width: 240, height: 240 ,  margin: 0 }, (err, svg) => {
        if (err) return console.error("QR Preview Error:", err);
        document.getElementById("qrcodePreview").innerHTML = svg;
    });
}

function imgGenerator() {
    const buttons = [
        document.getElementById("imgdownloadBtn"),
    ].filter(Boolean);
    const cardPreview = document.getElementById("download-area");
    if (buttons.length === 0 || !cardPreview) return;
    // buttons.forEach(btn => btn.style.display = "none");
    document.getElementById("copyurl-section").style.display = "none";
    document.getElementById("footer-section-preview").style.display = "none";
    document.getElementById("footer-link").style.display = "flex";
    
    // document.getElementById("Closebtn").style.display = "none";
    html2canvas(cardPreview, 
        {   
            scale: 2,
            backgroundColor: "#fff",
            useCORS: true,
            windowWidth: 2560,
        })
    .then((canvas) => {
        const aspectRatio = canvas.height / canvas.width;
        const targetWidth = 400;
        const targetHeight = targetWidth * aspectRatio;
        const resizedCanvas = document.createElement("canvas");
        resizedCanvas.width = targetWidth;
        resizedCanvas.height = targetHeight;
        const ctx = resizedCanvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(canvas, 0, 0, targetWidth, targetHeight);
        const imgData = resizedCanvas.toDataURL("image/jpeg", 1);
        buttons.forEach((btn) => {
            btn.href = imgData;
            btn.download = `${Id}-DigiCard.jpeg`;
        });
    })
    .catch((err) => console.error("Image generation failed:", err));
    // buttons.forEach(btn => btn.style.display = "block");
    document.getElementById("copyurl-section").style.display = "flex";
    document.getElementById("footer-section-preview").style.display = "flex";
    // document.getElementById("Closebtn").style.display = "flex";
    document.getElementById("footer-link").style.display = "none";
}


// Safer event bindings
document.getElementById("vcarddownloadBtn")?.addEventListener("click", () => {
    const vcfPath = `https://goodconnext.com/card/CrestviewRealtors/Assets/Profile/${Id}.vcf`;
    const a = document. createElement("a");
    a.href = vcfPath;
    a.download = `${Id}.vcf`;
    a.click();
});

document.getElementById("vcarddownloadBtnMobile")?.addEventListener("click", () => {
    const vcfPath = `https://goodconnext.com/card/CrestviewRealtors/Assets/Profile/${Id}.vcf`;
    const a = document.createElement("a");
    a.href = vcfPath;
    a.download = `${Id}.vcf`;
    a.click();
});

document.getElementById("copyLink").addEventListener("click", function(e) {
    e.preventDefault();
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
        console.log("Link copied!");
    });
});

const cardPreview = document.getElementById("CardPreview");
const formContainer = document.getElementById("container");

document.getElementById("qrpreviewbtn").addEventListener("click", function () {
    cardPreview.style.top  = '0';
    cardPreview.style.transition = 'top 0.5s ease';
});

document.getElementById("qrpreviewbtnmobile").addEventListener("click", function () {
    cardPreview.style.top  = '0';
    cardPreview.style.transition = 'top 0.5s ease';

});

document.getElementById("Closebtn").addEventListener("click", function () {
    cardPreview.style.top  = '-9999px';
});

document.getElementById("qrpreviewbtnmobile").addEventListener("click", function () {
    cardPreview.style.top  = '0';
    cardPreview.style.transition = 'top 0.5s ease';
});

cardPreview.addEventListener("click",function(e){
    if (e.target === this) { 
        document.getElementById("Closebtn").click();
    }
});

formContainer.addEventListener("click",function(e){
    if (e.target === this) { 
        document.getElementById("formclosebtn").click();
    }
});


// ---------------- FORM FIELDS ----------------
const fields = {
    name: {
        input: document.getElementById("form-name"),
        error: document.getElementById("nameerr"),
        message: "Please enter your name",
        pattern: null,
        required: true
    },
    mobile: {
        input: document.getElementById("form-mobile"),
        error: document.getElementById("mobileerr"),
        message: "Enter a valid 10-digit mobile number",
        pattern: /^[6-9]\d{9}$/,
        required: true
    },
    email: {
        input: document.getElementById("form-email"),
        error: document.getElementById("emailerr"),
        message: "Enter a valid email address",
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        required: true
    },
    company: {
        input: document.getElementById("form-company"),
        required: false
    },
    digit: {
        input: document.getElementById("form-digit"),
        required: false
    }
};

// ---------------- SUBMIT FUNCTION ----------------
function sendToWhatsapp() {
    let isValid = true;

    Object.values(fields).forEach(field => {
        const value = field.input?.value.trim() || "";

        if (field.required) {
            if (field.error) field.error.innerHTML = "";
            field.input.classList.remove("error");

            if (!value || (field.pattern && !field.pattern.test(value))) {
                if (field.error) field.error.innerHTML = field.message;
                field.input.classList.add("error");
                isValid = false;
            }
        }
    });

    if (!isValid) return;

    // ---------------- MESSAGE ----------------
    const message =
        `Name : ${fields.name.input.value}\n` +
        `Mobile : ${fields.mobile.input.value}\n` +
        `Email : ${fields.email.input.value}\n` +
        `Company : ${fields.company.input.value || "—"}\n` +
        `Digital Card : ${fields.digit.input.value || "—"}`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");

    // ---------------- CLEAR FORM ----------------
    Object.values(fields).forEach(field => {
        field.input.value = "";
        if (field.error) field.error.innerHTML = "";
        field.input.classList.remove("error");
    });
}

// ---------------- LIVE ERROR CLEAR ----------------
Object.values(fields).forEach(field => {
    if (!field.required) return;

    field.input.addEventListener("input", () => {
        const value = field.input.value.trim();

        if (value && (!field.pattern || field.pattern.test(value))) {
            if (field.error) field.error.innerHTML = "";
            field.input.classList.remove("error");
        }
    });
});

// OPEN FORM
document.getElementById("openbtn").addEventListener("click", function () {
    const formcardPreview = document.getElementById("container");
    formcardPreview.style.top = '0';
    formcardPreview.style.transition = 'top 0.5s ease';
});

// CLOSE FORM
document.getElementById("formclosebtn").addEventListener("click", function (e) {
    e.preventDefault(); // prevent form submit
    const formcardPreview = document.getElementById("container");
    formcardPreview.style.top = '-9999px';
});

document.getElementById("openbtnmobile").addEventListener("click", function () {
    const formcardPreview = document.getElementById("container");
    formcardPreview.style.top = '0';
    formcardPreview.style.transition = 'top 0.5s ease';
});
