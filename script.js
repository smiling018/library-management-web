let books = [];
let issued = {};
let currentUser = null;

const members = [
  { username: "alimin", password: "1234", name: "Alamin" },
  { username: "karim", password: "abcd", name: "Karim" }
];

function login() {
  const role = document.getElementById("role").value;
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  const msg = document.getElementById("loginMessage");

  if (role === "admin" && user === "admin" && pass === "admin123") {
    show("adminSection");
    hide("loginSection");
  } else {
    const found = members.find(m => m.username === user && m.password === pass);
    if (found) {
      currentUser = found;
      show("memberSection");
      hide("loginSection");
    } else {
      msg.innerText = "❌ Invalid credentials.";
    }
  }
}

function logout() {
  currentUser = null;
  show("loginSection");
  hide("adminSection");
  hide("memberSection");
  document.getElementById("output").innerHTML = "";
}

function addBook() {
  const name = document.getElementById("bookName").value;
  const writer = document.getElementById("writerName").value;
  books.push({ No: books.length + 1, bookName: name, writer: writer, issuedBy: null, issueDate: null });
  document.getElementById("output").innerText = `✅ Book "${name}" by ${writer} added.`;
}

function viewBooks() {
  const output = books.map(b => {
    let status = b.issuedBy ? `Issued to ${b.issuedBy}` : "Available";
    return `#${b.No} - ${b.bookName} by ${b.writer} [${status}]`;
  }).join("\n");
  document.getElementById("output").innerText = output || "❌ No books available.";
}

function searchWriter() {
  const input = document.getElementById("searchWriter").value.toLowerCase();
  const match = books.find(b => levenshtein(input, b.writer.toLowerCase()) <= 3);
  if (!match) {
    document.getElementById("output").innerText = "❌ No matching writer found.";
    return;
  }
  const filtered = books.filter(b => b.writer.toLowerCase() === match.writer.toLowerCase());
  document.getElementById("output").innerText = filtered.map(b => `#${b.No} - ${b.bookName}`).join("\n");
}

function issueBook() {
  const no = parseInt(document.getElementById("issueNo").value);
  const book = books.find(b => b.No === no);
  if (!book) return document.getElementById("output").innerText = "❌ Book not found.";
  if (book.issuedBy) return document.getElementById("output").innerText = "❌ Already issued.";
  book.issuedBy = currentUser.name;
  book.issueDate = new Date();
  document.getElementById("output").innerText = `✅ Book #${no} issued to ${currentUser.name}.`;
}

function returnBook() {
  const no = parseInt(document.getElementById("returnNo").value);
  const book = books.find(b => b.No === no && b.issuedBy === currentUser.name);
  if (!book) return document.getElementById("output").innerText = "❌ You didn’t issue this book.";
  const now = new Date();
  const days = (now - new Date(book.issueDate)) / (1000 * 60 * 60 * 24);
  const fine = days > 7 ? Math.floor((days - 7) * 5) : 0;
  book.issuedBy = null;
  book.issueDate = null;
  document.getElementById("output").innerText = fine
    ? `⚠ Returned late. Fine: ${fine} units.`
    : `✅ Returned successfully.`;
}

function show(id) {
  document.getElementById(id).classList.remove("hidden");
}

function hide(id) {
  document.getElementById(id).classList.add("hidden");
}

// Levenshtein Distance Function (Fuzzy Matching)
function levenshtein(a, b) {
  const dp = Array(a.length + 1).fill().map(() => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[a.length][b.length];
}
