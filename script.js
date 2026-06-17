/* ========= THEME ========= */
function applyTheme() {
    const t = localStorage.getItem('sg_theme') || 'light';
    document.body.className = t;
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = t === 'light' ? '🌙 Dark' : '☀️ Light';
}
document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    const tBtn = document.getElementById('themeToggle');
    if (tBtn) tBtn.onclick = () => {
        const cur = localStorage.getItem('sg_theme') || 'light';
        localStorage.setItem('sg_theme', cur === 'light' ? 'dark' : 'light');
        applyTheme();
    };

    /* ===== PROFILE GUARD ===== */
    const profile = JSON.parse(localStorage.getItem('sg_profile') || 'null');
    if (!profile && !location.pathname.endsWith('index.html') && location.pathname !== '/') {
        // redirect if not on profile page
        if (!location.pathname.includes('index')) location.href = 'index.html';
    }

    /* ===== PROFILE PANEL ===== */
    const pBtn = document.getElementById('profileBtn');
    const panel = document.getElementById('profilePanel');
    if (pBtn && panel) {
        pBtn.onclick = () => panel.classList.toggle('hidden');
        if (profile) {
            document.getElementById('pName').textContent = profile.name;
            document.getElementById('pDetail').textContent =
                `${profile.year} • ${profile.branch} • ${profile.college}`;
            const w = document.getElementById('welcomeName');
            if (w) w.textContent = profile.name.split(' ')[0];
        }
    }
    
    initPage();
});

/* ========= PAGE-SPECIFIC ========= */
function initPage() {
    /* ----- Profile form ----- */
    const pf = document.getElementById('profileForm');
    if (pf) {
        const existing = JSON.parse(localStorage.getItem('sg_profile') || 'null');
        if (existing) {
            name.value = existing.name; email.value = existing.email;
            college.value = existing.college; branch.value = existing.branch;
            year.value = existing.year; goal.value = existing.goal || '';
        }
        pf.onsubmit = (e) => {
            e.preventDefault();
            const data = {
    name: name.value,
    email: email.value,
    college: college.value,
    branch: branch.value,
    year: year.value,
    goal: goal.value,
    studyHours:
        Number(studyHours.value) || 0
};
            localStorage.setItem('sg_profile', JSON.stringify(data));
            
             localStorage.setItem(
        'sg_studyHours',
        studyHours
    );
            alert('Profile saved! 🎉');
            location.href = 'dashboard.html';
        };
    }

    /* ----- Notes ----- */
    if (document.getElementById('saveNote')) {
        const list = document.getElementById('notesList');
        renderNotes();

        document.getElementById('saveNote').onclick = () => {
            const t = noteTitle.value.trim(), b = noteBody.value.trim();
            if (!t || !b) return alert('Fill both fields');
            const notes = getNotes();
            notes.push({ id: Date.now(), title: t, body: b, type: 'text' });
            saveNotes(notes); noteTitle.value = ''; noteBody.value = '';
            renderNotes();
            updateStreak();
        };
        document.getElementById('resetNote').onclick = () => {
            noteTitle.value = ''; noteBody.value = '';
        };
        document.getElementById('uploadBtn').onclick = () => {
            const f = uploadFile.files[0];
            if (!f) return alert('Select a file');
            const reader = new FileReader();
            reader.onload = (e) => {
                const notes = getNotes();
                notes.push({ id: Date.now(), title: f.name, body: e.target.result, type: 'file' });
                saveNotes(notes); renderNotes();
                alert('Uploaded & saved!');
                updateStreak();
            };
            reader.readAsDataURL(f);
        };

        function renderNotes() {
            const notes = getNotes();
            list.innerHTML = notes.length ? '' : '<p>No notes yet.</p>';
            notes.forEach(n => {
                const div = document.createElement('div');
                div.className = 'note-item';
                div.innerHTML = `
          <div><strong>${n.title}</strong>
          <p style="font-size:.85rem;opacity:.8">${n.type === 'text' ? n.body.substring(0, 60) + '…' : '📎 File attached'}</p></div>
          <div>
            ${n.type === 'file' ? `<a href="${n.body}" download="${n.title}" class="btn ghost">⬇</a>` : ''}
            <button class="btn danger" onclick="delNote(${n.id})">✕</button>
          </div>`;
                list.appendChild(div);
            });
        }
    }

    /* ----- Chatbot ----- */
    if (document.getElementById('sendMsg')) {
        const box = document.getElementById('chatbox');
        document.getElementById('sendMsg').onclick = sendMsg;
        document.getElementById('userMsg').addEventListener('keypress', e => { if (e.key === 'Enter') sendMsg(); });
        document.getElementById('resetChat').onclick = () => {
            box.innerHTML = '<div class="msg bot">Chat reset. Ask anything 📘</div>';
        };

        let chats =
            Number(localStorage.getItem("sg_chatCount")) || 0;

        localStorage.setItem(
            "sg_chatCount",
            chats + 1
        );

        function sendMsg() {
            const txt = userMsg.value.trim(); if (!txt) return;
            addMsg(txt, 'user'); userMsg.value = '';
            setTimeout(() => addMsg(genieReply(txt), 'bot'), 600);
        }
        function addMsg(t, c) { const d = document.createElement('div'); d.className = 'msg ' + c; d.textContent = t; box.appendChild(d); box.scrollTop = box.scrollHeight; }


    updateStreak();
    }

// Streak

function updateStreak(){

    const today =
    new Date().toDateString();

    const lastDate =
    localStorage.getItem(
        "sg_lastActiveDate"
    );

    let streak =
    Number(
        localStorage.getItem(
            "sg_streak"
        )
    ) || 0;

    if(!lastDate){

        streak = 1;

    }else{

        const diff =
        Math.floor(
            (
                new Date(today) -
                new Date(lastDate)
            ) /
            (1000*60*60*24)
        );

        if(diff === 1){

            streak++;

        }
        else if(diff > 1){

            streak = 1;

        }
    }

    localStorage.setItem(
        "sg_streak",
        streak
    );

    localStorage.setItem(
        "sg_lastActiveDate",
        today
    );
}
/* ----- AI Progress Tracker ----- */

if (document.getElementById("analyzeProgress")) {

    // Stats

    const notesCount =
        getNotes().length || 0;

    const profile =
JSON.parse(
    localStorage.getItem("sg_profile")
) || {};

const studyHours =
Number(profile.studyHours) || 0;

    const chatbotUsage =
        Number(localStorage.getItem("sg_chatCount")) || 0;

    const streakDays =
        Number(localStorage.getItem("sg_streak")) || 0;
        

        


    // Update Stats Cards

    const notesEl =
        document.getElementById("notesCount");

    const hoursEl =
        document.getElementById("hoursCount");

    const chatEl =
        document.getElementById("chatCount");

    const streakEl =
        document.getElementById("streakCount");

    if (notesEl)
        notesEl.textContent = notesCount;

    if (hoursEl)
        hoursEl.textContent = studyHours;

    if (chatEl)
        chatEl.textContent = chatbotUsage;

    if (streakEl)
        streakEl.textContent = streakDays;

    // Calculate Score

    function calculateScore() {

        const notesScore =
            Math.min(notesCount * 5, 35);

        const hoursScore =
            Math.min(studyHours * 3, 40);

        const chatScore =
            Math.min(chatbotUsage * 2, 15);

        const streakScore =
            Math.min(streakDays * 2, 10);

        return (
            notesScore +
            hoursScore +
            chatScore +
            streakScore
        );
    }

    // Generate Report

    document
        .getElementById("analyzeProgress")
        .addEventListener("click", () => {

            const score =
                calculateScore();

            let rankTitle =
                "🌱 Beginner";

            let rankDesc =
                "Start completing daily study activities.";

            if (score >= 80) {

                rankTitle =
                    "👑 Study Master";

                rankDesc =
                    "Outstanding consistency and learning discipline.";

            }

            else if (score >= 60) {

                rankTitle =
                    "🚀 Achiever";

                rankDesc =
                    "You are progressing faster than most students.";

            }

            else if (score >= 40) {

                rankTitle =
                    "🔥 Consistent";

                rankDesc =
                    "Good momentum. Keep pushing daily.";

            }

            else if (score >= 20) {

                rankTitle =
                    "📚 Learner";

                rankDesc =
                    "You are building a strong study habit.";

            }

            // Update Rank Card

            const rankTitleEl =
                document.getElementById("rankTitle");

            const rankDescEl =
                document.getElementById("rankDesc");

            if (rankTitleEl)
                rankTitleEl.textContent =
                rankTitle;

            if (rankDescEl)
                rankDescEl.textContent =
                rankDesc;

            // Insights

            const insights = [];

            if (notesCount < 5) {

                insights.push(
                    "📒 Create more notes to improve retention."
                );

            } else {

                insights.push(
                    "✅ Your note-taking habit is strong."
                );
            }

            if (studyHours < 10) {

                insights.push(
                    "⏰ Increase study hours for better growth."
                );

            } else {

                insights.push(
                    "🔥 Great study consistency this week."
                );
            }

            if (chatbotUsage < 5) {

                insights.push(
                    "🤖 Use AI Genie more often for doubt solving."
                );

            } else {

                insights.push(
                    "💡 Excellent usage of AI-assisted learning."
                );
            }

            if (streakDays >= 5) {

                insights.push(
                    `🏆 Amazing ${streakDays}-day study streak.`
                );
            }

            insights.push(
                `📊 Overall Progress Score: ${score}/100`
            );

            const insightsEl =
                document.getElementById("insights");

            if (insightsEl) {

                insightsEl.innerHTML =
                    insights
                        .map(item =>
                            `<li>${item}</li>`
                        )
                        .join("");
            }

            // Button Animation

            const btn =
                document.getElementById(
                    "analyzeProgress"
                );

            btn.textContent =
                "✅ Report Generated";

            setTimeout(() => {

                btn.textContent =
                    "🧠 Generate Study Report";

            }, 2500);

        });

    // Mission Complete Buttons

    document
        .querySelectorAll(".mission-btn")
        .forEach(btn => {

            btn.addEventListener(
                "click",
                () => {

                    btn.textContent =
                        "✓ Completed";

                    btn.classList.add(
                        "completed"
                    );

                    btn.disabled = true;

                }
            );

        });

}

/* ----- Timer ----- */
    if (document.getElementById('startTimer')) {

        let total = 0;
        let remaining = 0;
        let interval = null;

        const disp = document.getElementById('timerDisplay');

        // Show default timer
        show(0);

        // START
        document.getElementById('startTimer').onclick = () => {

            if (interval) return;

            // Agar timer pehle start nahi hua
            if (remaining <= 0) {

                const h = parseInt(document.getElementById('hrs').value) || 0;
                const m = parseInt(document.getElementById('mins').value) || 0;
                const s = parseInt(document.getElementById('secs').value) || 0;

                total = h * 3600 + m * 60 + s;

                if (total <= 0) {
                    alert('⏱ Please set a valid time first.');
                    return;
                }

                remaining = total;
                show(remaining);
            }

            interval = setInterval(tick, 1000);
        };

        // PAUSE
        document.getElementById('pauseTimer').onclick = () => {
            clearInterval(interval);
            interval = null;
        };

        // RESET
        document.getElementById('resetTimer').onclick = () => {

            clearInterval(interval);
            interval = null;

            total = 0;
            remaining = 0;

            document.getElementById('hrs').value = '';
            document.getElementById('mins').value = '';
            document.getElementById('secs').value = '';

            show(0);
        };

        // TIMER FUNCTION
        function tick() {

            remaining--;

            show(remaining);

            if (remaining <= 0) {

                clearInterval(interval);
                interval = null;

                // Study hours tracking
                const oldHours =
                    Number(localStorage.getItem("sg_studyHours")) || 0;

                localStorage.setItem(
                    "sg_studyHours",
                    oldHours + (total / 3600)
                );

                alert('🎉 Time Up! Great job studying!');
                updateStreak();
            }
        }

        // DISPLAY FORMAT
        function show(seconds) {

            const h = String(Math.floor(seconds / 3600)).padStart(2, '0');

            const m = String(
                Math.floor((seconds % 3600) / 60)
            ).padStart(2, '0');

            const s = String(
                seconds % 60
            ).padStart(2, '0');

            disp.textContent = `${h}:${m}:${s}`;
        }
    }
}

    /* ========= HELPERS ========= */
    function getNotes() { return JSON.parse(localStorage.getItem('sg_notes') || '[]'); }
    function saveNotes(n) { localStorage.setItem('sg_notes', JSON.stringify(n)); }
    function delNote(id) {
        saveNotes(getNotes().filter(n => n.id !== id));
        location.reload();
    }

