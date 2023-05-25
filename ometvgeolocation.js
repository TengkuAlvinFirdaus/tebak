// ==UserScript==
// @name         Ome.tv IP Geolocation
// @license      MIT License
// @namespace    https://github.com/Rann-Studio/Ome.tv-IP-geolocation
// @version      0.2
// @description  Ome.tv IP Geolocation By RannStudio
// @author       RannStudio
// @match        https://ome.tv/
// @icon         https://www.google.com/s2/favicons?domain=ome.tv
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Masukkan kunci API geolokasi di sini
    var apiKey = "c4752ce3d8d7e4";

    // Objek untuk menerjemahkan kode negara menjadi nama
    var regionNames = new Intl.DisplayNames(['en'], {type: 'region'});

    // Fungsi untuk menambahkan pesan ke kotak obrolan Ome.tv
    var addMessage = (msg) => {
        try {
            var putData = document.getElementsByClassName("message-bubble")[0].firstChild;
            var div = document.createElement("div");
            div.setAttribute("class","logitem")
            var p = document.createElement("p");
            p.setAttribute("class","statuslog");
            p.innerText = msg;
            div.appendChild(p);
            putData.appendChild(div);
        } catch (e) {
            console.error(e);
        }
    };

    // Mengganti kelas RTCPeerConnection yang ada agar dapat memantau koneksi jaringan dan memanggil fungsi getLocation
    window.oRTCPeerConnection =
        window.oRTCPeerConnection || window.RTCPeerConnection;

    window.RTCPeerConnection = function (...args) {
        const pc = new window.oRTCPeerConnection(...args);

        pc.oaddIceCandidate = pc.addIceCandidate;

        pc.addIceCandidate = function (iceCandidate, ...rest) {
            const fields = iceCandidate.candidate.split(" ");

            const ip = fields[4];
            if (fields[7] === "srflx") {
                getLocation(ip);
            }
            return pc.oaddIceCandidate(iceCandidate, ...rest);
        };
        return pc;
    };

    // Fungsi untuk mendapatkan lokasi IP dan menambahkan pesan ke kotak obrolan
    var getLocation = async (ip) => {
        try {
            let url = `https://ipinfo.io/${ip}?token=${apiKey}`;
            const response = await fetch(url);
            const json = await response.json();
            const output = `
--------------------------
IP        : ${json.ip}
Country   : ${regionNames.of(json.country)}
State     : ${json.city}
City      : ${json.region}
Lat / Long: ${json.loc}
Org       : ${json.org}
Phone     : ${json.phone}
Domain    : ${json.domain}
--------------------------
`;
            addMessage(output);
        } catch (e) {
            console.error(e);
        }
    };

    // Menambahkan tombol "Report User" di kotak obrolan Ome.tv
    var addButton = () => {
        try {
            var logbox = document.getElementsByClassName("logbox")[0];
            var reportButton = document.createElement("button");
            reportButton.setAttribute("class", "report-button");
            reportButton.innerText = "Report User";
            reportButton.addEventListener("click", function() {
                window.open("https://support.ome.tv/hc/en-us/requests/new", "_blank");
            });
            logbox.appendChild(reportButton);
        } catch (e) {
            console.error(e);
        }
    };

    // Menjalankan fungsi addButton setelah kotak obrolan dimuat
    var checkLoaded = setInterval(() => {
        if (document.getElementsByClassName("logbox")[0]) {
            clearInterval(checkLoaded);
            addButton();
        }
    }, 1000);
})();
