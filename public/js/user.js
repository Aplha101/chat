
document.getElementById('logoutBtn').addEventListener('click', () => {
      localStorage.clear();
      window.location.href = 'login.html';
    });

    document.addEventListener('DOMContentLoaded', () => {
        const username = localStorage.getItem('username');
        const email = localStorage.getItem('useremail');
        const dateJoined = localStorage.getItem('dateJoined');
        document.getElementById('email').textContent = `Email: ${email}`;
        document.getElementById('dateJoined').textContent = `Date Joined: ${dateJoined}`;
        document.getElementById('username').textContent = `Username: ${username}`;
    });

    document.addEventListener('DOMContentLoaded', () => {
        const username = localStorage.getItem("username");
        const email = localStorage.getItem("useremail");
        const p = localStorage.getItem("pfp");
        if(p){
            document.getElementById('pfp').src = p;
        } else {
            document.getElementById('pfp').src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
        }
        let pass = "";

        if (username) {
            document.getElementById('username').textContent = `Username: ${username}`;
        }
        if (email) {
            document.getElementById('email').textContent = `Email: ${email}`;
        }

        const api = 'f8ddea1856c0c07f72fdcb51d3998290';

        let pfplink = " " ;
        const img = document.getElementById('imageUpload');
        img.addEventListener('change', async (e) => {
            console.log(e.target.files[0]);

            const formData = new FormData();
            formData.append("image", e.target.files[0]);

            await axios.post(`https://api.imgbb.com/1/upload?key=${api}`, formData)
                .then((res) => {
                    console.log("Image uploaded to imgbb:", res.data);
                    pfplink = res.data.data.display_url;
                    localStorage.setItem('pfp', pfplink);
                });
            await axios.get('https://sheetdb.io/api/v1/0qhgmvc12pifg')
                .then((e) => {
                    console.log(e);
                    for (let i = 0; i < e.data.length; i++) {
                        if (e.data[i].Username == username && e.data[i].Email == email) {
                            console.log(e.data[i]);
                            pass = e.data[i].Password;
                            break;
                        }
                    }
                });
          await axios.delete(`https://sheetdb.io/api/v1/0qhgmvc12pifg/Email/${email}`);
            await axios.post("https://sheetdb.io/api/v1/0qhgmvc12pifg", {
                data: {
                    Username: username,
                    Email: email,
                    Password: pass,
                    pfp: pfplink
                }
            });

            // update image
            let pfp = document.getElementById('pfp');
            let link = localStorage.getItem('pfp');
            pfp.src = link;
        });
    });