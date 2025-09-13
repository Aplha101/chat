document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = 'login.html';
});

document.addEventListener('DOMContentLoaded', () => {
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("useremail");
  const p = localStorage.getItem("pfp");
  const dateJoined = localStorage.getItem("dateJoined");
  const id = localStorage.getItem("id");
const Friends = localStorage.getItem("Friends") || "";
  // set profile picture from localStorage if available
  if (p) {
    document.getElementById('pfp').src = p;
  } else {
    document.getElementById('pfp').src =
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
  }

  if (username) {
    document.getElementById('username').textContent = `Username: ${username}`;
  }
  if (email) {
    document.getElementById('email').textContent = `Email: ${email}`;
  }
  if (dateJoined) {
    document.getElementById('dateJoined').textContent = `Date Joined: ${dateJoined}`;
  }

  const api = 'f8ddea1856c0c07f72fdcb51d3998290';

  let pfplink = "";
  const img = document.getElementById('pfpInput'); // ✅ correct id

  img.addEventListener('change', async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    // upload to imgbb
    await axios.post(`https://api.imgbb.com/1/upload?key=${api}`, formData)
      .then((res) => {
        console.log("Image uploaded to imgbb:", res.data);
        pfplink = res.data.data.display_url;
        localStorage.setItem('pfp', pfplink);
      });
    let pass = "";
    await axios.get('https://sheetdb.io/api/v1/0qhgmvc12pifg')
      .then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].Username == username && res.data[i].Email == email) {
            pass = res.data[i].Password;
            break;
          }
        }
      });

    // delete old record
    await axios.delete(`https://sheetdb.io/api/v1/0qhgmvc12pifg/Email/${email}`);

    // re-insert new record with updated pfp
    await axios.post("https://sheetdb.io/api/v1/0qhgmvc12pifg", {
      data: {
        Username: username,
        Email: email,
        Password: pass,
        dateJoined: dateJoined,
        pfp: pfplink,
        id: id,
        Friends: Friends
      }
    });

    // update image on page
    document.getElementById('pfp').src = localStorage.getItem('pfp');
  });
});
