import './style.css'
import './ads.css'

async function loadGames() {
    try {
        const res = await fetch("/list-game.json");
        const games = await res.json();

        const container = document.getElementById("games_list");
        if (!container) {
            console.warn("games_list not found");
            return;
        }

        games.forEach(game => {
            const a = document.createElement("a");
            a.href = game.url;
            a.title = game.title;

            a.innerHTML = `
              <div class="game-display">
                <img src="${game.image}" width="208" height="208" alt="${game.title} img">
                <div class="ab-title-wrap"><p>${game.title}</p></div>
              </div>
            `;
            container.appendChild(a);
        });
    } catch (err) {
        console.error("Failed to load games:", err);
    }
}

loadGames();

document.addEventListener("DOMContentLoaded", async () => {
    const iframe = document.getElementById("iframehtml5");
    let path = window.location.pathname;

    if (!iframe) {
        console.warn("iframehtml5 not found");
        return;
    }

    if (path.startsWith("/")) {
        path = path.slice(1); // Remove "/"
    }

    if (path === "") {
        path = "/src/game.embed"; // default game
    }

    const targetFile = `/${path}.html`;

    try {
        const res = await fetch(targetFile, { method: "HEAD" });
        if (res.ok) {
            iframe.src = targetFile;
            iframe.title = path;
        } else {
            iframe.src = "/src/game.embed.html";
            iframe.title = "Default Game";
        }
    } catch (err) {
        console.error(err);
        iframe.src = "/src/game.embed.html";
        iframe.title = "Default Game";
    }

    console.log(iframe.src)
});
