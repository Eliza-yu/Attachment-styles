const questions = [
  "When someone doesn't reply for a while...",
  "When conflict happens...",
  "When someone gets emotionally close...",
  "If I like someone...",
  "When I need support...",
  "If someone pulls away...",
  "My biggest fear is...",
  "When things go well...",
  "I describe myself as...",
  "When someone says 'I need space'..."
];

const options = {
  A: "Secure",
  B: "Anxious",
  C: "Avoidant",
  D: "Fearful-Avoidant"
};

const answersText = [
  ["Assume they're busy.", "Wonder if I did something wrong.", "Feel annoyed and move on.", "Feel anxious but pretend not to care."],
  ["Talk calmly.", "Need reassurance.", "Withdraw.", "Want to talk but also run."],
  ["Feel comfortable.", "Happy but worried.", "Slightly trapped.", "Want closeness but don’t trust it."],
  ["Steady pace.", "Think about them constantly.", "Downplay feelings.", "Feel strongly but scared."],
  ["Can ask for it.", "Worry about being too much.", "Handle alone.", "Struggle to open up."],
  ["Give space.", "Try harder.", "Feel relieved.", "Pretend not to care."],
  ["Not growing together.", "Being abandoned.", "Losing independence.", "Getting hurt."],
  ["Enjoy it.", "Wait for it to fail.", "Need space.", "Happy but uneasy."],
  ["Stable.", "Emotional.", "Independent.", "Guarded."],
  ["Understand.", "Are they leaving?", "Good.", "That hurts."]
];

const form = document.getElementById("quizForm");

questions.forEach((q, index) => {
  const div = document.createElement("div");
  div.className = "question";
  div.innerHTML = `<h3>${index + 1}. ${q}</h3>`;
  
  ["A","B","C","D"].forEach((letter, i) => {
    div.innerHTML += `
      <label>
        <input type="radio" name="q${index}" value="${letter}" required>
        ${letter}. ${answersText[index][i]}
      </label><br>
    `;
  });

  form.appendChild(div);
});

function submitQuiz() {
  const formData = new FormData(form);
  let counts = {A:0,B:0,C:0,D:0};

  for (let pair of formData.entries()) {
    counts[pair[1]]++;
  }

  let result = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  let finalResult = options[result];

  fetch("/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers: counts, result: finalResult })
  });

  document.getElementById("result").innerHTML =
    `<h2>Your Style Might Be: ${finalResult} 💖</h2>`;
}
