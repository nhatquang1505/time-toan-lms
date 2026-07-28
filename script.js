// --- 1. CONFIGURATION & STATE ---
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw4rqVzYJYgnQy8pxXH962wjO141Gq6qwfj_ttRxoryom-cQrXTb0wUQZZdxWbrluAsFg/exec';
const WEB_APP_URL = SCRIPT_URL;
const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/1M6nnyKRVkTdafDdOm4w-UWnKQyvqt9qhDw13_g5TiDo/edit?usp=sharing";

let currentUser = null; // { type: 'student'|'teacher', maHS: '', hoTen: '', lop: '' }
let currentExam = null; // { title: '', questions: [] }
let studentAnswers = {}; // { qId: value }

// Dynamic News List (read ngay, loaiTin, tieuDe, noiDung from getNews)
let newsData = [];

// Dynamic Documents List (read tieuDe, loaiFile, moTa, linkFile from getDocs)
let docData = [];

// --- 2. SAMPLE LATEX EXAM SPLIT (PART I, PART II, PART III) WITH EX_TEST MACROS & TABULAR ---
const SAMPLE_LATEX_P1 = `
% ==========================================
% PHẦN I: TRẮC NGHIỆM 4 LỰA CHỌN (12 CÂU)
% ==========================================
%[2D1-1.2-3] %[Thầy TiMe]
\\begin{ex}
  \\immini{Cho hàm số $y = f(x) = x^3 - 3x + 2$. Giá trị cực đại của hàm số đã cho bằng}{
    \\begin{tikzpicture}[scale=0.55]
      \\draw[->] (-2,0) -- (3,0) node[right] {$x$};
      \\draw[->] (0,-1) -- (0,5) node[above] {$y$};
      \\draw[domain=-1.8:2.1, smooth, variable=\\x, blue, thick] plot ({\\x}, {\\x*\\x*\\x - 3*\\x + 2});
      \\fill (-1,4) circle (2pt) node[above left] {$CD(-1;4)$};
    \\end{tikzpicture}
  }
  \\choice
  {$y_{CD} = 0$}
  {\\True $y_{CD} = 4$}
  {$y_{CD} = 2$}
  {$y_{CD} = -1$}
  \\loigiai{
    Ta có $f'(x) = 3x^2 - 3 = 0 \\Leftrightarrow \\hoac{x = 1 \\\\ x = -1}$.
    Bảng biến thiên cho thấy tại $x = -1$ hàm số đạt cực đại và $y_{CD} = f(-1) = 4$.
  }
\\end{ex}

%[2D1-2.1-1]
\\begin{ex}
  Cho bảng biến thiên của hàm số $y = \\dfrac{2x + 1}{x - 1}$ như sau:
  \\begin{center}
    \\begin{tabular}{|c|ccccc|}
      \\hline
      $x$ & $-\\infty$ & & $1$ & & $+\\infty$ \\\\
      \\hline
      $f'(x)$ & & $+$ & $0$ & $-$ & \\\\
      \\hline
      $f(x)$ & & $\\nearrow$ & $4$ & $\\searrow$ & \\\\
      \\hline
    \\end{tabular}
  \\end{center}
  Tiệm cận đứng của đồ thị hàm số $y = \\dfrac{2x + 1}{x - 1}$ là đường thẳng
  \\choice
  {$y = 2$}
  {$x = -1$}
  {\\True $x = 1$}
  {$y = 1$}
  \\loigiai{
    Tập xác định $D = \\mathbb{R} \\setminus \\{1\\}$. Nghiệm mẫu số $x - 1 = 0 \\Leftrightarrow x = 1$.
  }
\\end{ex}

%[2D1-3.2-2]
\\begin{ex}
  Xét bài toán sản xuất với chi phí $C(x)$ cho bởi
  $$ C(x) = \\heva{& 20x + 100 & \\text{ khi } 0 \\le x \\le 50 \\\\ & 18x + 200 & \\text{ khi } x > 50} $$
  Tìm tập nghiệm của hệ phương trình \\heva{& x + y = 3 \\\\ & 2x - y = 3}.
  \\choice
  {$(1; 2)$}
  {\\True $(2; 1)$}
  {$(3; 0)$}
  {$(0; 3)$}
  \\loigiai{
    Cộng hai phương trình ta được $3x = 6 \\Leftrightarrow x = 2 \\Rightarrow y = 1$.
  }
\\end{ex}

\\begin{ex}
  Tập xác định của hàm số $y = (x - 1)^{\\frac{1}{3}}$ là
  \\choice
  {\\True $(1; +\\infty)$}
  {$[1; +\\infty)$}
  {$\\mathbb{R} \\setminus \\{1\\}$}
  {$\\mathbb{R}$}
  \\loigiai{
    Hàm số lũy thừa với số mũ không nguyên xác định khi cơ số dương: $x - 1 > 0 \\Leftrightarrow x > 1$.
  }
\\end{ex}

\\begin{ex}
  Đạo hàm của hàm số $y = \\log_2(x + 1)$ là
  \\choice
  {$y' = \\dfrac{1}{x+1}$}
  {\\True $y' = \\dfrac{1}{(x+1)\\ln 2}$}
  {$y' = \\dfrac{\\ln 2}{x+1}$}
  {$y' = \\dfrac{1}{\\ln 2}$}
  \\loigiai{
    Áp dụng công thức $(\\log_a u)' = \\dfrac{u'}{u \\ln a}$.
  }
\\end{ex}

\\begin{ex}
  Trong không gian $Oxyz$, cho điểm $A(1; 2; -3)$. Hình chiếu vuông góc của $A$ lên mặt phẳng $(Oxy)$ là
  \\choice
  {$M(1; 0; -3)$}
  {$M(0; 2; -3)$}
  {\\True $M(1; 2; 0)$}
  {$M(0; 0; -3)$}
  \\loigiai{
    Hình chiếu lên $(Oxy)$ giữ nguyên $x, y$ và cho $z = 0$.
  }
\\end{ex}

\\begin{ex}
  Cho khối chóp có diện tích đáy $B = 6$ và chiều cao $h = 5$. Thể tích khối chóp đã cho bằng
  \\choice
  {$30$}
  {\\True $10$}
  {$15$}
  {$20$}
  \\loigiai{
    Công thức thể tích khối chóp $V = \\frac{1}{3} B h = \\frac{1}{3} \\cdot 6 \\cdot 5 = 10$.
  }
\\end{ex}

\\begin{ex}
  Họ tất cả các nguyên hàm của hàm số $f(x) = \\cos x$ là
  \\choice
  {$-\\sin x + C$}
  {\\True $\\sin x + C$}
  {$-\\cos x + C$}
  {$\\frac{1}{2}\\cos^2 x + C$}
  \\loigiai{
    Ta có $(\\sin x)' = \\cos x$.
  }
\\end{ex}

\\begin{ex}
  Nghiệm của phương trình $\\log_3(2x - 1) = 2$ là
  \\choice
  {$x = 4$}
  {\\True $x = 5$}
  {$x = \\dfrac{9}{2}$}
  {$x = 3$}
  \\loigiai{
    $2x - 1 = 3^2 = 9 \\Leftrightarrow 2x = 10 \\Leftrightarrow x = 5$.
  }
\\end{ex}

\\begin{ex}
  Cho cấp số cộng $(u_n)$ có $u_1 = 3$ và công sai $d = 2$. Giá trị $u_2$ bằng
  \\choice
  {\\True $5$}
  {$6$}
  {$1$}
  {$8$}
  \\loigiai{
    $u_2 = u_1 + d = 3 + 2 = 5$.
  }
\\end{ex}

\\begin{ex}
  Số giao điểm của đồ thị hàm số $y = x^4 - 2x^2$ và trục hoành là
  \\choice
  {$1$}
  {$2$}
  {\\True $3$}
  {$4$}
  \\loigiai{
    Cho $x^4 - 2x^2 = 0 \\Leftrightarrow x^2(x^2 - 2) = 0 \\Leftrightarrow \\hoac{x = 0 \\\\ x = \\pm \\sqrt{2}}$.
  }
\\end{ex}

\\begin{ex}
  Trong mặt phẳng tọa độ, điểm biểu diễn số phức $z = 3 - 4i$ có tọa độ là
  \\choice
  {$(3; 4)$}
  {$\\True (3; -4)$}
  {$(-3; -4)$}
  {$(-4; 3)$}
  \\loigiai{
    Số phức $z = a + bi$ có điểm biểu diễn $M(a; b)$.
  }
\\end{ex}
`.trim();

const SAMPLE_LATEX_P2 = `
% ==========================================
% PHẦN II: TRẮC NGHIỆM ĐÚNG / SAI (4 CÂU)
% ==========================================
%[2D1-4.2-4]
\\begin{ex}
  Cho hàm số $y = f(x) = \\dfrac{x^2 + 3}{x + 1}$. Xét tính đúng sai của các mệnh đề sau:
  \\choiceTF
  {\\True Tập xác định của hàm số là $D = \\mathbb{R} \\setminus \\{-1\\}$.}
  {Hàm số đồng biến trên khoảng $(-\\infty; -1)$.}
  {\\True Đồ thị hàm số có đường tiệm cận xiên là $y = x - 1$.}
  {Giá trị nhỏ nhất của hàm số trên khoảng $(-1; +\\infty)$ bằng $3$.}
  \\loigiai{
    Ta có $y = x - 1 + \\dfrac{4}{x+1}$.
    - Tập xác định $D = \\mathbb{R} \\setminus \\{-1\\}$.
    - $y' = 1 - \\dfrac{4}{(x+1)^2} = 0 \\Leftrightarrow \\hoac{x = 1 \\\\ x = -3}$.
    - Tiệm cận xiên $y = x - 1$.
  }
\\end{ex>

\\begin{ex}
  Trong không gian $Oxyz$, cho mặt cầu $(S): x^2 + y^2 + z^2 - 2x + 4y - 6z - 2 = 0$. Xét các mệnh đề sau:
  \\choiceTF
  {\\True Mặt cầu $(S)$ có tâm $I(1; -2; 3)$.}
  {Bán kính mặt cầu $(S)$ bằng $R = 4$.}
  {\\True Điểm $A(1; -2; 7)$ nằm ngoài mặt cầu $(S)$.}
  {Mặt phẳng $(Oxy)$ cắt mặt cầu $(S)$ theo giao tuyến là đường tròn có bán kính $r = 3$.}
  \\loigiai{
    - Tâm $I(1; -2; 3)$, $R = \\sqrt{1^2 + (-2)^2 + 3^2 - (-2)} = \\sqrt{16} = 4$.
    - $IA = \\sqrt{0 + 0 + 4^2} = 4 = R \\Rightarrow A$ nằm trên mặt cầu.
  }
\\end{ex>

\\begin{ex}
  Cho hình chóp $S.ABCD$ có đáy $ABCD$ là hình vuông cạnh $a$, $SA \\bot (ABCD)$ và $SA = a\\sqrt{3}$.
  \\choiceTF
  {\\True Đường thẳng $BD$ vuông góc với mặt phẳng $(SAC)$.}
  {Góc giữa đường thẳng $SD$ và mặt phẳng $(ABCD)$ bằng $45^\\circ$.}
  {\\True Thể tích khối chóp $S.ABCD$ bằng $\\dfrac{a^3\\sqrt{3}}{3}$.}
  {Khoảng cách từ $A$ đến mặt phẳng $(SBD)$ bằng $\\dfrac{a\\sqrt{3}}{2}$.}
  \\loigiai{
    - $BD \\bot AC$ và $BD \\bot SA \\Rightarrow BD \\bot (SAC)$.
    - $V = \\frac{1}{3} a^2 \\cdot a\\sqrt{3} = \\frac{a^3\\sqrt{3}}{3}$.
  }
\\end{ex>

\\begin{ex}
  Một hộp chứa 5 quả cầu đỏ và 4 quả cầu xanh. Lấy ngẫu nhiên đồng thời 3 quả cầu.
  \\choiceTF
  {\\True Số phần tử của không gian mẫu là $n(\\Omega) = 84$.}
  {Xác suất để lấy được 3 quả cầu cùng màu đỏ bằng $\\dfrac{5}{42}$.}
  {\\True Xác suất để lấy được ít nhất 1 quả cầu xanh bằng $\\dfrac{37}{42}$.}
  {Xác suất để lấy được đủ 2 màu bằng $\\dfrac{25}{28}$.}
  \\loigiai{
    - $n(\\Omega) = C_9^3 = 84$.
    - 3 quả đỏ: $C_5^3 = 10 \\Rightarrow P = \\dfrac{10}{84} = \\dfrac{5}{42}$.
  }
\\end{ex>
`.trim();

const SAMPLE_LATEX_P3 = `
% ==========================================
% PHẦN III: TRẢ LỜI NGẮN (6 CÂU)
% ==========================================
\\begin{ex}
  Tính giá trị tích phân $I = \\int_0^1 (2x + 1) dx$.
  \\shortans{2}
  \\loigiai{
    $I = \\left[ x^2 + x \\right]_0^1 = 1 + 1 = 2$.
  }
\\end{ex}

\\begin{ex}
  Tìm giá trị lớn nhất của hàm số $y = x^3 - 3x$ trên đoạn $[0; 2]$.
  \\shortans{2}
  \\loigiai{
    $y' = 3x^2 - 3 = 0 \\Leftrightarrow x = 1 \\in [0;2]$. $y(2) = 2 \\Rightarrow \\max = 2$.
  }
\\end{ex}

\\begin{ex}
  Trong không gian $Oxyz$, cho hai điểm $A(1; 2; 3)$ và $B(3; 4; 5)$. Độ dài đoạn thẳng $AB$ bằng bao nhiêu? (Làm tròn 2 chữ số thập phân).
  \\shortans{3.46}
  \\loigiai{
    $AB = \\sqrt{(3-1)^2 + (4-2)^2 + (5-3)^2} = \\sqrt{12} \\approx 3.46$.
  }
\\end{ex}

\\begin{ex}
  Cho hàm số $y = f(x)$ có đạo hàm $f'(x) = x(x-1)^2(x+2)$. Hàm số có bao nhiêu điểm cực trị?
  \\shortans{2}
  \\loigiai{
    $f'(x) = 0$ tại $x = 0, x = 1$ (nghiệm kép), $x = -2$. Đổi dấu tại $x = 0$ và $x = -2$. Có 2 cực trị.
  }
\\end{ex}

\\begin{ex}
  Tìm môđun của số phức $z = (1 + 2i)(2 - i)$.
  \\shortans{5}
  \\loigiai{
    $|z| = |1+2i| \\cdot |2-i| = \\sqrt{5} \\cdot \\sqrt{5} = 5$.
  }
\\end{ex}

\\begin{ex}
  Cho hình chóp tam giác đều $S.ABC$ có cạnh đáy bằng $a = 3$ và chiều cao $h = 4$. Tính thể tích khối chóp. (Làm tròn 2 chữ số thập phân).
  \\shortans{5.20}
  \\loigiai{
    $V = \\frac{1}{3} B h = 3\\sqrt{3} \\approx 5.20$.
  }
\\end{ex>
`.trim();

// --- 3. UTILITIES, TOAST & FISHER-YATES SHUFFLE ---
function showToast(message, isSuccess = true) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  const toastIcon = document.getElementById('toastIcon');

  toastMsg.innerText = message;
  toast.className = `toast ${isSuccess ? 'toast-success' : 'toast-danger'} show`;
  toastIcon.className = `fa-solid ${isSuccess ? 'fa-circle-check status-correct' : 'fa-circle-xmark status-incorrect'}`;

  setTimeout(() => { toast.classList.remove('show'); }, 3500);
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function openGoogleSheetAdmin() {
  if (!GOOGLE_SHEET_URL) {
    showToast("Vui lòng cấu hình URL Google Sheet trong biến GOOGLE_SHEET_URL!", false);
    return;
  }
  window.open(GOOGLE_SHEET_URL, '_blank');
}

function goHome() {
  switchNavTab('home');
}

function switchNavTab(tabId) {
  // 1. Clear sub-path URLs and reset to root /
  if (window.location.pathname !== '/' || window.location.hash) {
    try {
      history.pushState(null, '', '/');
    } catch (e) {
      history.pushState(null, '', window.location.pathname);
    }
  }

  // 2. Reset active detail view state variables
  currentNewsRowIndex = null;
  currentDocRowIndex = null;
  currentShareType = 'news';

  // 3. Deactivate all tab sections and nav items
  document.querySelectorAll('.tab-section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

  // 4. Activate requested tab section
  if (tabId === 'home') {
    const homeSec = document.getElementById('homeSection');
    const homeTab = document.getElementById('navHomeTab');
    if (homeSec) homeSec.classList.add('active');
    if (homeTab) homeTab.classList.add('active');
    fetchNewsFromSheet();
  } else if (tabId === 'doc') {
    const docSec = document.getElementById('docSection');
    const docTab = document.getElementById('navDocTab');
    if (docSec) docSec.classList.add('active');
    if (docTab) docTab.classList.add('active');
    fetchDocsFromSheet();
  } else if (tabId === 'exam') {
    const examSec = document.getElementById('examSection');
    const examTab = document.getElementById('navExamTab');
    if (examSec) examSec.classList.add('active');
    if (examTab) examTab.classList.add('active');
  } else if (tabId === 'admin') {
    const adminSec = document.getElementById('adminSection');
    const adminTab = document.getElementById('navAdminTab');
    if (adminSec) adminSec.classList.add('active');
    if (adminTab) adminTab.classList.add('active');
  } else if (tabId === 'auth') {
    const authSec = document.getElementById('authSection');
    if (authSec) authSec.classList.add('active');
  }

  updateHeaderUI();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getStudentGrade(lopStr) {
  if (!lopStr) return '12';
  const str = String(lopStr).trim();
  if (/^10|10/i.test(str)) return '10';
  if (/^11|11/i.test(str)) return '11';
  if (/^12|12/i.test(str)) return '12';
  return '12';
}

function updateHeaderUI() {
  const badge = document.getElementById('userBadge');
  const name = document.getElementById('userBadgeName');
  const icon = document.getElementById('userBadgeIcon');
  const btn = document.getElementById('btnLoginLogout');
  const navExamTab = document.getElementById('navExamTab');
  const navAdminTab = document.getElementById('navAdminTab');
  const gradeTabsBar = document.querySelector('.grade-tabs-bar');
  const noticeEl = document.getElementById('studentGradeNotice');
  const studentDetailEl = document.getElementById('activeStudentDetail');

  if (currentUser) {
    badge.style.display = 'inline-flex';
    btn.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> Đăng Xuất';

    if (currentUser.type === 'teacher') {
      icon.className = 'fa-solid fa-user-shield';
      name.innerText = 'Admin / Giáo Viên';
      if (navExamTab) navExamTab.style.display = 'none';
      if (navAdminTab) navAdminTab.style.display = 'inline-flex';

      if (gradeTabsBar) {
        gradeTabsBar.style.display = 'flex';
        gradeTabsBar.style.pointerEvents = 'auto';
        gradeTabsBar.style.opacity = '1';
      }
      if (noticeEl) noticeEl.style.display = 'none';
      if (studentDetailEl) studentDetailEl.innerText = `Tài khoản: Admin / Giáo Viên`;
    } else {
      // Student logged in
      icon.className = 'fa-solid fa-user-graduate';
      name.innerText = `${currentUser.hoTen} (${currentUser.maHS})`;
      if (navExamTab) navExamTab.style.display = 'inline-flex';
      if (navAdminTab) navAdminTab.style.display = 'none';

      const studentGrade = getStudentGrade(currentUser.lop);
      currentGrade = studentGrade;

      if (studentDetailEl) {
        studentDetailEl.innerText = `Học sinh: ${currentUser.hoTen} - Lớp: ${currentUser.lop}`;
      }

      // Lock / Hide Grade selection tabs bar for student to prevent switching grade
      if (gradeTabsBar) {
        gradeTabsBar.style.display = 'none';
      }
      if (noticeEl) {
        noticeEl.style.display = 'inline-flex';
        noticeEl.innerHTML = `<i class="fa-solid fa-lock"></i> Đề thi dành riêng cho Khối ${studentGrade} (Lớp ${currentUser.lop})`;
      }
    }
  } else {
    // Anonymous / Guest
    badge.style.display = 'none';
    btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Đăng Nhập';
    if (navExamTab) navExamTab.style.display = 'inline-flex';
    if (navAdminTab) navAdminTab.style.display = 'none';

    if (studentDetailEl) {
      studentDetailEl.innerText = `Học sinh: Chưa đăng nhập`;
    }

    if (gradeTabsBar) {
      gradeTabsBar.style.display = 'flex';
      gradeTabsBar.style.pointerEvents = 'auto';
      gradeTabsBar.style.opacity = '1';
    }
    if (noticeEl) noticeEl.style.display = 'none';
  }
}

function resetStudentExamState() {
  studentAnswers = {};
  localStorage.removeItem('math_lms_answers');
  localStorage.removeItem('math_lms_result');

  const activeContainer = document.getElementById('examActiveContainer');
  const resultContainer = document.getElementById('resultRenderContainer');
  if (activeContainer) activeContainer.style.display = 'block';
  if (resultContainer) resultContainer.style.display = 'none';

  const questionsContainer = document.getElementById('questionsRenderContainer');
  if (questionsContainer) {
    const inputs = questionsContainer.querySelectorAll('input');
    inputs.forEach(input => {
      if (input.type === 'radio' || input.type === 'checkbox') input.checked = false;
      if (input.type === 'text') input.value = '';
    });
    const tfBtns = questionsContainer.querySelectorAll('.tf-btn');
    tfBtns.forEach(btn => {
      btn.className = 'tf-btn';
    });
  }

  const resP1 = document.getElementById('resP1');
  const resP2 = document.getElementById('resP2');
  const resP3 = document.getElementById('resP3');
  const resTotal = document.getElementById('resTotal');
  const resultList = document.getElementById('resultQuestionsList');
  if (resP1) resP1.innerText = '0.0';
  if (resP2) resP2.innerText = '0.0';
  if (resP3) resP3.innerText = '0.0';
  if (resTotal) resTotal.innerText = '0.0';
  if (resultList) resultList.innerHTML = '';
}

function handleAuthButtonClick() {
  if (currentUser) {
    currentUser = null;
    localStorage.removeItem('math_lms_user');
    resetStudentExamState();
    updateHeaderUI();
    showToast("Đã đăng xuất tài khoản");
    switchNavTab('home');
  } else {
    switchNavTab('auth');
  }
}

// Global Trigger Function (150ms Timeout)
function triggerRender() {
  setTimeout(() => {
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise().then(() => {
        if (window.tikzjax && typeof window.tikzjax.process === 'function') {
          try { window.tikzjax.process(); } catch (e) { console.log('TikZJax process error:', e); }
        }
      }).catch(err => console.log(err));
    }
  }, 150);
}

// Backward compatibility alias
const triggerMathAndTikzRender = triggerRender;

// --- 4. ADVANCED LATEX PRE-PROCESSOR (cleanAndParseLaTeX & cleanAndConvertTeX) ---
function cleanAndParseLaTeX(str) {
  if (!str) return '';

  // 1. TUYỆT ĐỐI KHÔNG DÙNG replace(/\\\\/g, '\\') VÌ SẼ XÓA DẤU XUỐNG DÒNG LATEX!

  // 2. Chuẩn hóa $6\%$ hoặc $6%$ thành 6% và chuyển \% thành %
  str = str.replace(/\$(\d+(?:[.,]\d+)?)\\?%\$/g, '$1%');
  str = str.replace(/\\%/g, '%');

  // 3. Bảo vệ ký hiệu % đứng sau số (ví dụ: 6%, 10%, 100%) trước khi lọc comment TeX
  str = str.replace(/(\d+(?:[.,]\d+)?)\s*%/g, '$1___PERCENT___');

  // 4. Xóa các comment ID6 (dạng %[thẻ]) và các comment TeX thực sự
  str = str.replace(/%\[.*?\]/g, '').replace(/(?:^|\s)%.*/g, '');

  // 5. Khôi phục lại ký hiệu % nguyên bản
  str = str.replace(/___PERCENT___/g, '%');

  // 6. Chuyển đổi môi trường itemize thành HTML
  str = str.replace(/\\begin\{itemize\}/g, '<ul style="margin-left:20px; margin-bottom:10px;">')
    .replace(/\\end\{itemize\}/g, '</ul>')
    .replace(/\\item\s+/g, '<li>');

  // 4. Chuyển môi trường center
  str = str.replace(/\\begin\{center\}/g, '<div style="text-align:center; margin:10px 0;">')
    .replace(/\\end\{center\}/g, '</div>');

  // Chuyển \tabular thành HTML table
  const tabularRegex = /\\begin\{tabular\}\s*\{[^}]*?\}([\s\S]*?)\\end\{tabular\}/gi;
  str = str.replace(tabularRegex, (fullMatch, body) => {
    let cleanBody = body.replace(/\\(hline|toprule|midrule|bottomrule)/g, '').trim();
    const rows = cleanBody.split(/\\\\/).map(r => r.trim()).filter(r => r.length > 0);

    let tableHtml = '<table class="latex-table">';
    rows.forEach(row => {
      tableHtml += '<tr>';
      const cells = row.split('&').map(c => c.trim());
      cells.forEach(cell => {
        tableHtml += `<td>${cell}</td>`;
      });
      tableHtml += '</tr>';
    });
    tableHtml += '</table>';
    return tableHtml;
  });

  // 5. Chuyển font nghiêng
  str = str.replace(/\{\\it\s+(.*?)\}/g, '<i>$1</i>');
  str = str.replace(/\\textit\{([^}]+)\}/g, '<i>$1</i>');

  // 6. Thuật toán đếm ngoặc nhọn bóc tách \immini an toàn tuyệt đối
  let output = "";
  let regex = /\\immini(?:\[.*?\])?\s*/g;
  let match;
  let lastIdx = 0;

  while ((match = regex.exec(str)) !== null) {
    output += str.substring(lastIdx, match.index);
    let i = regex.lastIndex;

    function extractBrace() {
      while (i < str.length && /\s/.test(str[i])) i++;
      if (str[i] !== '{') return null;
      let depth = 1;
      let start = i + 1;
      i++;
      while (i < str.length && depth > 0) {
        if (str[i] === '{') depth++;
        else if (str[i] === '}') depth--;
        i++;
      }
      return str.substring(start, i - 1);
    }

    let textPart = extractBrace();
    let figPart = extractBrace();

    if (textPart !== null && figPart !== null) {
      output += '<div style="display:flex; gap:15px; flex-wrap:wrap; margin:10px 0;">' +
        '<div style="flex:1; min-width:280px;">' + textPart + '</div>' +
        '<div style="text-align:center;">' + figPart + '</div>' +
        '</div>';
      lastIdx = i;
    } else {
      output += match[0];
      lastIdx = regex.lastIndex;
    }
  }
  str = output + str.substring(lastIdx);

  // 7. Bọc TikZ và tự động chèn thư viện tính toán tọa độ
  const openTag = '<' + 'script type="text/tikz">';
  const closeTag = '<' + '/script>';

  str = str.replace(/\\begin\{tikzpicture\}[\s\S]*?\\end\{tikzpicture\}/g, function (tikz) {
    let cleanTikz = tikz.replace(/\u00a0/g, ' ').replace(/pattern=[^,\]]+/g, 'fill=blue!15');
    let tikzWithLibs = '\\usetikzlibrary{calc,intersections,angles,quotes,math}\n' + cleanTikz;
    return '<div class="tikz-container">' + openTag + tikzWithLibs + closeTag + '</div>';
  });

  // 8. Hỗ trợ ảnh link dự phòng
  str = str.replace(/\\includegraphics(?:\[.*?\])?\{([^}]+)\}/g, function (m, src) {
    return '<img src="' + src + '" style="max-width:100%; max-height:350px; display:block; margin:auto; border-radius:6px;" />';
  });

  return str;
}

// Alias for backward compatibility
const cleanAndConvertTeX = cleanAndParseLaTeX;

function parseLaTeXExam(rawLatex, forcedPart = null) {
  const questions = [];
  const cleanedLatex = cleanAndParseLaTeX(rawLatex);

  const exRegex = /\\begin\{(ex|bt|cautracnghiem)\}([\s\S]*?)\\end\{\1\}/gi;
  let match;
  let count = 0;

  while ((match = exRegex.exec(cleanedLatex)) !== null) {
    count++;
    let rawBlock = match[2];

    // Extract \loigiai{...}
    let loigiai = "";
    const lgIndex = rawBlock.search(/\\loigiai\s*\{/);
    if (lgIndex !== -1) {
      const openBracePos = rawBlock.indexOf('{', lgIndex);
      let depth = 1;
      let i = openBracePos + 1;
      while (i < rawBlock.length && depth > 0) {
        if (rawBlock[i] === '{') depth++;
        else if (rawBlock[i] === '}') depth--;
        i++;
      }
      if (depth === 0) {
        loigiai = rawBlock.substring(openBracePos + 1, i - 1).trim();
        rawBlock = rawBlock.substring(0, lgIndex) + rawBlock.substring(i);
      }
    }

    if (rawBlock.includes('\\choiceTF')) {
      // Part II: True / False
      const parts = rawBlock.split('\\choiceTF');
      const stem = parts[0].trim();
      const choicesPart = parts.slice(1).join('\\choiceTF');
      const statements = [];
      let idx = 0;
      const labels = ['a', 'b', 'c', 'd'];

      for (let i = 0; i < 4; i++) {
        const braceStart = choicesPart.indexOf('{', idx);
        if (braceStart === -1) break;
        let depth = 1;
        let j = braceStart + 1;
        while (j < choicesPart.length && depth > 0) {
          if (choicesPart[j] === '{') depth++;
          else if (choicesPart[j] === '}') depth--;
          j++;
        }
        if (depth === 0) {
          let stmtText = choicesPart.substring(braceStart + 1, j - 1).trim();
          const isTrue = /\\True\b/i.test(stmtText);
          stmtText = stmtText.replace(/\\True\b/gi, '').trim();
          statements.push({ label: labels[i], text: stmtText, correct: isTrue });
          idx = j;
        }
      }

      questions.push({ id: count, type: 'choiceTF', part: forcedPart || 2, stem, statements, loigiai });

    } else if (rawBlock.includes('\\shortans') || rawBlock.includes('\\scans')) {
      // Part III: Short Answer
      const ansCmdRegex = /\\(shortans|scans)\s*\{/;
      const ansIndex = rawBlock.search(ansCmdRegex);
      let stem = rawBlock;
      let correctAnswer = "";

      if (ansIndex !== -1) {
        const openBracePos = rawBlock.indexOf('{', ansIndex);
        let depth = 1;
        let j = openBracePos + 1;
        while (j < rawBlock.length && depth > 0) {
          if (rawBlock[j] === '{') depth++;
          else if (rawBlock[j] === '}') depth--;
          j++;
        }
        if (depth === 0) {
          correctAnswer = rawBlock.substring(openBracePos + 1, j - 1).trim().replace(/\$/g, '').replace(/,/g, '.');
          stem = rawBlock.substring(0, ansIndex).trim();
        }
      }

      questions.push({ id: count, type: 'shortans', part: forcedPart || 3, stem, correctAnswer, loigiai });

    } else if (rawBlock.includes('\\choice')) {
      // Part I: Multiple Choice
      const parts = rawBlock.split('\\choice');
      const stem = parts[0].trim();
      const choicesPart = parts.slice(1).join('\\choice');
      const options = [];
      let correctIndex = -1;
      let idx = 0;
      const labels = ['A', 'B', 'C', 'D'];

      for (let i = 0; i < 4; i++) {
        const braceStart = choicesPart.indexOf('{', idx);
        if (braceStart === -1) break;
        let depth = 1;
        let j = braceStart + 1;
        while (j < choicesPart.length && depth > 0) {
          if (choicesPart[j] === '{') depth++;
          else if (choicesPart[j] === '}') depth--;
          j++;
        }
        if (depth === 0) {
          let optText = choicesPart.substring(braceStart + 1, j - 1).trim();
          if (/\\True\b/i.test(optText)) {
            correctIndex = i;
            optText = optText.replace(/\\True\b/gi, '').trim();
          }
          options.push({ label: labels[i], text: optText });
          idx = j;
        }
      }

      questions.push({ id: count, type: 'choice', part: forcedPart || 1, stem, options, correctIndex, loigiai });
    }
  }

  return questions;
}

// --- 5. AUTHENTICATION LOGIC ---
function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab-btn')[0].classList.toggle('active', tab === 'student');
  document.querySelectorAll('.auth-tab-btn')[1].classList.toggle('active', tab === 'teacher');
  document.getElementById('studentLoginForm').style.display = tab === 'student' ? 'block' : 'none';
  document.getElementById('teacherLoginForm').style.display = tab === 'teacher' ? 'block' : 'none';
}

// Student Login Verification (getStudents)
async function handleStudentLogin(e) {
  e.preventDefault();
  const maHS = document.getElementById('studentId').value.trim();
  const matKhau = document.getElementById('studentPass').value.trim();
  const btn = document.getElementById('btnStudentSubmit');

  if (!maHS || !matKhau) {
    showToast("Vui lòng nhập đầy đủ Mã học sinh và Mật khẩu!", false);
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang Kiểm Tra...';

  try {
    const response = await fetch(WEB_APP_URL + "?action=getStudents");
    const data = await response.json();

    if (Array.isArray(data)) {
      const studentObj = data.find(s => {
        const targetMa = String(s.maHS || s.MaHS || "").trim().toLowerCase();
        const targetPass = String(s.matKhau || s.MatKhau || "").trim();
        return targetMa === maHS.toLowerCase() && targetPass === matKhau;
      });

      if (studentObj) {
        currentUser = {
          type: 'student',
          maHS: studentObj.maHS || studentObj.MaHS || maHS,
          hoTen: studentObj.hoTen || studentObj.HoTen || `Học sinh ${maHS}`,
          lop: studentObj.lop || studentObj.Lop || '12A'
        };

        // Persistent Session Storage
        localStorage.setItem('math_lms_user', JSON.stringify(currentUser));

        // Reset previous exam/result state completely
        resetStudentExamState();

        const studentGrade = getStudentGrade(currentUser.lop);

        updateHeaderUI();
        showToast(`Đăng nhập thành công! Chào ${currentUser.hoTen}`);
        switchNavTab('exam');
        loadExamForStudent(studentGrade);
      } else {
        showToast("Mã học sinh hoặc mật khẩu không chính xác!", false);
      }
    } else {
      showToast("Không thể tải danh sách học sinh từ hệ thống!", false);
    }
  } catch (err) {
    console.error("Lỗi xác thực:", err);
    showToast("Lỗi kết nối Server! Vui lòng thử lại sau.", false);
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Đăng Nhập Học Sinh';
  }
}

// Admin Login Verification (getAdminPass from tab CaiDat)
async function handleTeacherLogin(e) {
  e.preventDefault();
  const pass = document.getElementById('teacherPass').value.trim();
  const btn = document.getElementById('btnTeacherSubmit');

  if (!pass) return;

  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang Xác Thực Sheet...';

  let validPass = "Toan12A3@2026"; // Fallback

  try {
    const response = await fetch(WEB_APP_URL + "?action=getAdminPass");
    const data = await response.json();

    if (typeof data === 'string' && data.trim()) {
      validPass = data.trim();
    } else if (data && typeof data === 'object') {
      validPass = String(data.password || data.adminPass || data.pass || data.val || data.B1 || validPass).trim();
    }
  } catch (err) {
    console.warn("Không thể lấy mật khẩu Admin từ Sheet:", err);
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-lock"></i> Đăng Nhập Quản Trị';
  }

  if (pass === validPass) {
    currentUser = { type: 'teacher', hoTen: 'Admin / Giáo Viên' };
    updateHeaderUI();
    switchNavTab('admin');
    showToast("Đăng nhập Admin thành công!");
  } else {
    showToast("Mật khẩu Admin không chính xác!", false);
  }
}

function formatDateVN(dateStr) {
  if (!dateStr) return '';
  let d = new Date(dateStr);

  // Nếu không phải chuỗi ngày hợp lệ thì giữ nguyên chuỗi ngắn (loại bỏ 00:00:00 GMT...)
  if (isNaN(d.getTime())) {
    return String(dateStr).split('00:00:00')[0].trim();
  }

  // Định dạng ngày/tháng/năm chuẩn Việt Nam (VD: 22/07/2026)
  let day = String(d.getDate()).padStart(2, '0');
  let month = String(d.getMonth() + 1).padStart(2, '0');
  let year = d.getFullYear();

  return `${day}/${month}/${year}`;
}

// --- 6. DYNAMIC NEWS FETCHING & REACTION SYNC (getNews & reactNews) ---
async function fetchNewsFromSheet() {
  const container = document.getElementById('newsContainer');
  container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
          <i class="fa-solid fa-spinner fa-spin fa-2x" style="color: var(--accent-cyan);"></i>
          <p style="margin-top: 12px; font-weight: 500;">Đang tải tin tức...</p>
        </div>
      `;

  try {
    const res = await fetch(WEB_APP_URL + "?action=getNews");
    const data = await res.json();

    if (Array.isArray(data) && data.length > 0) {
      newsData = data.map((item, index) => ({
        rowIndex: item.rowIndex || item.row || (index + 2),
        ngay: item.ngay || item.date || new Date().toLocaleDateString('vi-VN'),
        loaiTin: item.loaiTin || item.loai || item.category || "Thông báo",
        tieuDe: item.tieuDe || item.title || "Thông báo mới",
        noiDung: item.noiDung || item.content || item.moTa || "",
        luotThich: parseInt(item.luotThich || item.thich || item.like || 0, 10),
        luotKhongThich: parseInt(item.luotKhongThich || item.khongThich || item.dislike || 0, 10)
      }));
    } else {
      newsData = [];
    }
    renderNews(newsData);
    if (pendingRouteNewsId && newsData && newsData.length > 0) {
      const index = newsData.findIndex(item => Number(item.rowIndex) === pendingRouteNewsId);
      if (index !== -1) {
        openNewsDetail(index, false);
        pendingRouteNewsId = null;
      }
    } else {
      checkUrlRoute();
    }
  } catch (err) {
    console.warn("Lỗi tải tin tức từ Sheet:", err);
    newsData = [];
  }
}

let pendingRouteNewsId = null;
let currentNewsRowIndex = null;

async function reactNews(rowIndex, type) {
  if (type === 'like') {
    const el = document.getElementById(`like-count-${rowIndex}`);
    const modalEl = document.getElementById(`like-count-modal-${rowIndex}`);
    const singleEl = document.getElementById(`like-count-single-${rowIndex}`);
    if (el) el.innerText = parseInt(el.innerText || '0', 10) + 1;
    if (modalEl) modalEl.innerText = parseInt(modalEl.innerText || '0', 10) + 1;
    if (singleEl) singleEl.innerText = parseInt(singleEl.innerText || '0', 10) + 1;
  } else if (type === 'dislike') {
    const el = document.getElementById(`dislike-count-${rowIndex}`);
    const modalEl = document.getElementById(`dislike-count-modal-${rowIndex}`);
    const singleEl = document.getElementById(`dislike-count-single-${rowIndex}`);
    if (el) el.innerText = parseInt(el.innerText || '0', 10) + 1;
    if (modalEl) modalEl.innerText = parseInt(modalEl.innerText || '0', 10) + 1;
    if (singleEl) singleEl.innerText = parseInt(singleEl.innerText || '0', 10) + 1;
  }

  try {
    const params = new URLSearchParams();
    params.append('action', 'reactNews');
    params.append('rowIndex', rowIndex);
    params.append('type', type);

    await fetch(SCRIPT_URL + '?action=reactNews', {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: params.toString()
    });
  } catch (err) {
    console.error("Lỗi gửi tương tác lên Google Sheets:", err);
  }
}

function renderNews(newsList = newsData) {
  const list = newsList || newsData;
  const container = document.getElementById('newsContainer');
  if (!list || list.length === 0) {
    container.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 30px; color: var(--text-muted);">
            <i class="fa-solid fa-newspaper fa-2x" style="margin-bottom: 10px;"></i>
            <p>Chưa có tin tức nào trong hệ thống.</p>
          </div>
        `;
    return;
  }

  container.innerHTML = list.map((item, index) => `
        <div class="news-card col-12 col-md-6 mb-4" onclick="openNewsDetail(${index})">
          <div class="news-date">
            <i class="fa-regular fa-calendar-check"></i> ${formatDateVN(item.ngay || item.date)} ${item.loaiTin ? ' • <span style="color: var(--accent-cyan); font-weight: 700;">' + item.loaiTin + '</span>' : ''}
          </div>
          <div class="news-title">${item.tieuDe}</div>
          <div class="news-content">${item.noiDung}</div>

          <!-- Independent Cumulative Like / Dislike Reaction Bar -->
          <div class="news-vote-bar" onclick="event.stopPropagation()">
            <button type="button" class="vote-btn vote-like" onclick="event.stopPropagation(); reactNews(${item.rowIndex}, 'like')">
              👍 Thích <span id="like-count-${item.rowIndex}" class="vote-count">${item.luotThich || 0}</span>
            </button>
            <button type="button" class="vote-btn vote-dislike" onclick="event.stopPropagation(); reactNews(${item.rowIndex}, 'dislike')">
              👎 Không thích <span id="dislike-count-${item.rowIndex}" class="vote-count">${item.luotKhongThich || 0}</span>
            </button>
          </div>
        </div>
      `).join('');
}

function openNewsDetail(index, pushState = true) {
  const item = newsData[index];
  if (!item) return;

  currentNewsRowIndex = item.rowIndex;

  // 1. Push clean URL path /tintuc/[id]
  if (pushState) {
    try {
      history.pushState({ newsId: item.rowIndex }, '', '/tintuc/' + item.rowIndex);
    } catch (e) {
      history.pushState({ newsId: item.rowIndex }, '', '#news-' + item.rowIndex);
    }
  }

  // 2. Populate Standalone Detail Page Section (#newsDetailSection)
  const singleDate = document.getElementById('singleNewsDate');
  const singleCat = document.getElementById('singleNewsCategory');
  const singleTitle = document.getElementById('singleNewsTitle');
  const singleContent = document.getElementById('singleNewsContent');
  const singleReaction = document.getElementById('singleNewsReaction');

  if (singleDate) singleDate.innerHTML = `<i class="fa-regular fa-calendar-check"></i> ${formatDateVN(item.ngay || item.date)}`;
  if (singleCat) singleCat.innerText = item.loaiTin || 'Thông báo';
  if (singleTitle) singleTitle.innerText = item.tieuDe || 'Chi tiết thông báo';

  if (singleContent) {
    const formattedContent = (item.noiDung || '').replace(/\n/g, '<br>');
    singleContent.innerHTML = formattedContent;
  }

  if (singleReaction) {
    singleReaction.innerHTML = `
      <button type="button" class="vote-btn vote-like" onclick="reactNews(${item.rowIndex}, 'like')">
        👍 Thích <span id="like-count-single-${item.rowIndex}" class="vote-count">${item.luotThich || 0}</span>
      </button>
      <button type="button" class="vote-btn vote-dislike" onclick="reactNews(${item.rowIndex}, 'dislike')">
        👎 Không thích <span id="dislike-count-single-${item.rowIndex}" class="vote-count">${item.luotKhongThich || 0}</span>
      </button>
    `;
  }

  // 3. Switch Tab view to #newsDetailSection
  document.querySelectorAll('.tab-section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));

  const detailSection = document.getElementById('newsDetailSection');
  if (detailSection) detailSection.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function backToNewsList() {
  currentNewsRowIndex = null;
  try {
    history.pushState(null, '', '/');
  } catch (e) {
    history.pushState(null, '', window.location.pathname);
  }
  switchNavTab('home');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

let currentShareType = 'news'; // 'news' | 'doc'
let currentDocRowIndex = null;
let pendingRouteDocId = null;
let currentDocLink = '#';

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
}

function getShareUrl() {
  if (currentShareType === 'doc' && currentDocRowIndex) {
    try {
      return `${window.location.origin}/tailieu/${currentDocRowIndex}`;
    } catch (e) {
      return `${window.location.href}`;
    }
  } else if (currentNewsRowIndex) {
    try {
      return `${window.location.origin}/tintuc/${currentNewsRowIndex}`;
    } catch (e) {
      return `${window.location.href}`;
    }
  }
  return window.location.href;
}

function getShareTitle() {
  if (currentShareType === 'doc') {
    const docTitle = document.getElementById('singleDocTitle');
    if (docTitle && docTitle.innerText.trim()) return docTitle.innerText.trim();
  }
  const singleTitle = document.getElementById('singleNewsTitle');
  const modalTitle = document.getElementById('newsModalTitle');
  if (singleTitle && singleTitle.innerText.trim()) return singleTitle.innerText.trim();
  if (modalTitle && modalTitle.innerText.trim()) return modalTitle.innerText.trim();
  return "Thông báo & Bài Giảng Toán THPT";
}

async function shareNews() {
  currentShareType = 'news';
  const shareTitle = getShareTitle();
  const shareUrl = getShareUrl();

  if (isMobileDevice() && navigator.share) {
    try {
      await navigator.share({
        title: shareTitle,
        text: shareTitle,
        url: shareUrl
      });
      showToast("Đã chia sẻ bài viết thành công!");
      return;
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.log("Mobile Web Share API error:", err);
      } else {
        return;
      }
    }
  }

  openShareModal();
}

function shareDoc() {
  currentShareType = 'doc';
  shareNews();
}

function openShareModal() {
  const modal = document.getElementById('shareModal');
  if (modal) {
    modal.classList.add('active');
  }
}

function closeShareModal(e) {
  if (e && e.target && !e.target.classList.contains('news-modal-overlay') && !e.target.classList.contains('news-modal-close') && e.target.tagName !== 'BUTTON') {
    return;
  }
  const modal = document.getElementById('shareModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function shareToFacebook() {
  const url = getShareUrl();
  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  window.open(fbShareUrl, '_blank', 'width=600,height=450,noopener,noreferrer');
  closeShareModal();
}

function shareToZalo() {
  const url = getShareUrl();
  const zaloShareUrl = `https://zalo.me/share?url=${encodeURIComponent(url)}`;
  window.open(zaloShareUrl, '_blank', 'width=600,height=450,noopener,noreferrer');
  closeShareModal();
}

function shareToInstagram() {
  const url = getShareUrl();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      showToast("📸 Đã sao chép liên kết! Đang chuyển hướng sang Instagram...");
    }).catch(() => {
      fallbackCopyTextToClipboard(url);
    });
  } else {
    fallbackCopyTextToClipboard(url);
  }
  closeShareModal();
  setTimeout(() => {
    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
  }, 400);
}

function shareToTikTok() {
  const url = getShareUrl();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      showToast("🎵 Đã sao chép liên kết! Đang chuyển hướng sang TikTok...");
    }).catch(() => {
      fallbackCopyTextToClipboard(url);
    });
  } else {
    fallbackCopyTextToClipboard(url);
  }
  closeShareModal();
  setTimeout(() => {
    window.open("https://www.tiktok.com/", "_blank", "noopener,noreferrer");
  }, 400);
}

function copyNewsLinkFromShareModal() {
  const url = getShareUrl();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      showToast("Đã sao chép liên kết!");
      closeShareModal();
    }).catch(() => {
      fallbackCopyTextToClipboard(url);
      closeShareModal();
    });
  } else {
    fallbackCopyTextToClipboard(url);
    closeShareModal();
  }
}

function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast("Đã sao chép liên kết!");
  } catch (err) {
    showToast("Không thể sao chép tự động. Hãy copy đường link trên thanh địa chỉ!", false);
  }
  document.body.removeChild(textArea);
}

function checkUrlRoute() {
  const pathname = window.location.pathname;
  const hash = window.location.hash;

  let targetNewsId = null;
  let targetDocId = null;

  // 1. News Route Check (/tintuc/:id or #news-:id)
  const newsPathMatch = pathname.match(/\/tintuc\/(\d+)/i);
  if (newsPathMatch) {
    targetNewsId = parseInt(newsPathMatch[1], 10);
  } else {
    const newsHashMatch = hash.match(/#news-(\d+)/i);
    if (newsHashMatch) targetNewsId = parseInt(newsHashMatch[1], 10);
  }

  // 2. Document Route Check (/tailieu/:id or #doc-:id)
  const docPathMatch = pathname.match(/\/tailieu\/(\d+)/i);
  if (docPathMatch) {
    targetDocId = parseInt(docPathMatch[1], 10);
  } else {
    const docHashMatch = hash.match(/#doc-(\d+)/i);
    if (docHashMatch) targetDocId = parseInt(docHashMatch[1], 10);
  }

  if (targetNewsId && !isNaN(targetNewsId)) {
    currentShareType = 'news';
    if (newsData && newsData.length > 0) {
      const index = newsData.findIndex(item => Number(item.rowIndex) === targetNewsId);
      if (index !== -1) {
        openNewsDetail(index, false);
      }
    } else {
      pendingRouteNewsId = targetNewsId;
    }
  } else if (targetDocId && !isNaN(targetDocId)) {
    currentShareType = 'doc';
    if (docData && docData.length > 0) {
      const index = docData.findIndex(item => Number(item.rowIndex) === targetDocId);
      if (index !== -1) {
        openDocDetail(index, false);
      }
    } else {
      pendingRouteDocId = targetDocId;
    }
  } else {
    const newsDetailSec = document.getElementById('newsDetailSection');
    const docDetailSec = document.getElementById('docDetailSection');
    if (newsDetailSec && newsDetailSec.classList.contains('active')) {
      switchNavTab('home');
    } else if (docDetailSec && docDetailSec.classList.contains('active')) {
      switchNavTab('doc');
    }
  }
}

// --- 7. DYNAMIC DOCS FETCHING (getDocs from tab TaiLieu) ---
async function fetchDocsFromSheet() {
  const container = document.getElementById('docContainer');
  container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
          <i class="fa-solid fa-spinner fa-spin fa-2x" style="color: var(--primary);"></i>
          <p style="margin-top: 12px; font-weight: 500;">Đang tải danh sách bài giảng & tài liệu...</p>
        </div>
      `;

  try {
    const res = await fetch(WEB_APP_URL + "?action=getDocs");
    const data = await res.json();

    if (Array.isArray(data) && data.length > 0) {
      docData = data.map((item, index) => ({
        rowIndex: item.rowIndex || item.row || item.id || (index + 1),
        tieuDe: item.tieuDe || item.tenTaiLieu || item.tenTL || item.title || "Tài liệu Toán THPT",
        loaiFile: item.loaiFile || item.loaiTaiLieu || item.loai || "PDF",
        moTa: item.moTa || item.description || "",
        linkFile: item.linkFile || item.link || item.url || "#",
        ngay: item.ngay || item.date || item.ngayDang || "28/07/2026"
      }));
    } else {
      docData = [];
    }
  } catch (err) {
    console.warn("Lỗi tải tài liệu từ Sheet:", err);
    docData = [];
  }

  renderDocs();

  if (pendingRouteDocId && docData && docData.length > 0) {
    const index = docData.findIndex(item => Number(item.rowIndex) === pendingRouteDocId);
    if (index !== -1) {
      openDocDetail(index, false);
      pendingRouteDocId = null;
    }
  } else {
    checkUrlRoute();
  }
}

function formatDateShort(dateStr) {
  if (!dateStr) return '';
  let d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  let day = String(d.getDate()).padStart(2, '0');
  let month = String(d.getMonth() + 1).padStart(2, '0');
  let year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function renderDocs() {
  const container = document.getElementById('docContainer');
  if (!docData || docData.length === 0) {
    container.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 30px; color: var(--text-muted);">
            <i class="fa-solid fa-folder-open fa-2x" style="margin-bottom: 10px;"></i>
            <p>Chưa có tài liệu nào trong hệ thống.</p>
          </div>
        `;
    return;
  }

  container.innerHTML = docData.map((item, index) => {
    let iconClass = "fa-file-pdf";
    const loaiLower = String(item.loaiFile || '').toLowerCase();
    if (loaiLower.includes('pdf')) iconClass = "fa-file-pdf";
    else if (loaiLower.includes('video')) iconClass = "fa-video";
    else if (loaiLower.includes('word') || loaiLower.includes('doc')) iconClass = "fa-file-word";
    else if (loaiLower.includes('tex') || loaiLower.includes('latex')) iconClass = "fa-file-code";

    let ngayHienThi = formatDateShort(item.ngay || item.ngayDang || item.date);
    const subInfo = `${item.loaiFile}${item.moTa ? ' • ' + item.moTa : ''}${ngayHienThi ? ' • 🗓️ ' + ngayHienThi : ''}`;

    return `
          <div class="doc-card col-12 col-md-6 mb-3" onclick="openDocDetail(${index})">
            <div class="doc-icon"><i class="fa-solid ${iconClass}"></i></div>
            <div class="doc-body">
              <div class="doc-title">${item.tieuDe}</div>
              <div class="doc-meta text-muted small">${subInfo}</div>
            </div>
          </div>
        `;
  }).join('');
}

function openDocDetail(index, pushState = true) {
  const item = docData[index];
  if (!item) return;

  currentShareType = 'doc';
  currentDocRowIndex = item.rowIndex;
  currentDocLink = item.linkFile || '#';

  // 1. Push Clean Path URL /tailieu/[id]
  if (pushState) {
    try {
      history.pushState({ docId: item.rowIndex }, '', '/tailieu/' + item.rowIndex);
    } catch (e) {
      history.pushState({ docId: item.rowIndex }, '', '#doc-' + item.rowIndex);
    }
  }

  // 2. Populate Standalone Document View (#docDetailSection)
  const singleDocType = document.getElementById('singleDocType');
  const singleDocIcon = document.getElementById('singleDocIcon');
  const singleDocTitle = document.getElementById('singleDocTitle');
  const singleDocMeta = document.getElementById('singleDocMeta');
  const singleDocDesc = document.getElementById('singleDocDesc');

  let iconClass = "fa-file-pdf";
  const loaiLower = String(item.loaiFile || '').toLowerCase();
  if (loaiLower.includes('pdf')) iconClass = "fa-file-pdf";
  else if (loaiLower.includes('video')) iconClass = "fa-video";
  else if (loaiLower.includes('word') || loaiLower.includes('doc')) iconClass = "fa-file-word";
  else if (loaiLower.includes('tex') || loaiLower.includes('latex')) iconClass = "fa-file-code";

  let ngayHienThi = formatDateShort(item.ngay || item.ngayDang || item.date);

  if (singleDocType) singleDocType.innerText = item.loaiFile || 'PDF';
  if (singleDocIcon) singleDocIcon.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;
  if (singleDocTitle) singleDocTitle.innerText = item.tieuDe || 'Tiêu đề tài liệu';
  if (singleDocMeta) singleDocMeta.innerText = `${item.loaiFile || 'Tài liệu'}${item.moTa ? ' • ' + item.moTa : ''}${ngayHienThi ? ' • 🗓️ ' + ngayHienThi : ''}`;
  if (singleDocDesc) singleDocDesc.innerHTML = (item.moTa || 'Không có mô tả chi tiết cho tài liệu này.').replace(/\n/g, '<br>');

  // 3. Switch Tab view to #docDetailSection
  document.querySelectorAll('.tab-section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));

  const docDetailSection = document.getElementById('docDetailSection');
  if (docDetailSection) docDetailSection.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function backToDocList() {
  currentDocRowIndex = null;
  currentShareType = 'news';
  try {
    history.pushState(null, '', '/');
  } catch (e) {
    history.pushState(null, '', window.location.pathname);
  }
  switchNavTab('doc');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openCurrentDocLink() {
  if (!currentDocLink || currentDocLink === '#' || currentDocLink === 'undefined') {
    showToast("Đường dẫn tài liệu chưa được cập nhật!", false);
    return;
  }
  window.open(currentDocLink, '_blank');
}

function openDocLink(url) {
  if (!url || url === '#' || url === 'undefined') {
    showToast("Đường dẫn tài liệu không hợp lệ hoặc chưa được cập nhật!", false);
    return;
  }
  window.open(url, '_blank');
}

// --- 8. ADMIN MANAGEMENT & EXAM PUBLISHING (3 SPLIT TEXTAREAS & GOOGLE SHEETS EXAM SYNC) ---
function loadSampleLatexExam() {
  document.getElementById('latexP1Input').value = SAMPLE_LATEX_P1;
  document.getElementById('latexP2Input').value = SAMPLE_LATEX_P2;
  document.getElementById('latexP3Input').value = SAMPLE_LATEX_P3;
  showToast("Đã nạp đề mẫu 3 phần (Phần I, II, III) chuẩn THPT!");
}

let currentGrade = '12';

function switchStudentGrade(grade) {
  if (currentUser && currentUser.type === 'student') {
    const allowedGrade = getStudentGrade(currentUser.lop);
    if (String(grade) !== allowedGrade) {
      showToast(`Học sinh lớp ${currentUser.lop} chỉ được làm đề Khối ${allowedGrade}!`, false);
      currentGrade = allowedGrade;
    } else {
      currentGrade = String(grade);
    }
  } else {
    currentGrade = String(grade);
  }

  ['10', '11', '12'].forEach(g => {
    const btn = document.getElementById('gradeTab' + g);
    if (btn) btn.classList.toggle('active', g === currentGrade);
  });
  loadExamFromSheets(currentGrade);
}

function getAdminExamTitle() {
  const el = document.getElementById('adminExamTitle') || document.getElementById('examTitleInput');
  return el ? el.value.trim() : '';
}

function setAdminExamTitle(title) {
  const el1 = document.getElementById('adminExamTitle');
  const el2 = document.getElementById('examTitleInput');
  if (el1) el1.value = title;
  if (el2) el2.value = title;
}

function loadExamForAdmin() {
  const select = document.getElementById('adminGradeSelect');
  const grade = select ? select.value : currentGrade;
  loadExamFromSheets(grade);
}

async function saveExamToSheets(p1, p2, p3) {
  const select = document.getElementById('adminGradeSelect');
  const grade = select ? select.value : (currentGrade || '12');

  const titleInputVal = getAdminExamTitle();
  const tenDe = titleInputVal || `Đề Thi Kiểm Tra Môn Toán - Khối ${grade}`;

  // LocalStorage backups for specific grade
  localStorage.setItem(`lms_p1_${grade}`, p1);
  localStorage.setItem(`lms_p2_${grade}`, p2);
  localStorage.setItem(`lms_p3_${grade}`, p3);
  localStorage.setItem('lms_p1', p1);
  localStorage.setItem('lms_p2', p2);
  localStorage.setItem('lms_p3', p3);
  localStorage.setItem(`math_lms_latex_${grade}`, JSON.stringify({ tenDe, title: tenDe, part1: p1, part2: p2, part3: p3 }));

  if (!p1 && !p2 && !p3) {
    if (typeof showToast === 'function') {
      showToast('Nội dung đề thi đang trống!', false);
    } else {
      alert('Nội dung đề thi đang trống!');
    }
    return;
  }

  try {
    const params = new URLSearchParams();
    params.append('action', 'saveExam');
    params.append('grade', grade);
    params.append('tenDe', tenDe);
    params.append('title', tenDe);
    params.append('part1', p1);
    params.append('part2', p2);
    params.append('part3', p3);

    await fetch(SCRIPT_URL + '?action=saveExam', {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: params.toString()
    });

    if (typeof showToast === 'function') {
      showToast(`Đã lưu và phát đề thi Khối ${grade} vĩnh viễn lên Google Sheets thành công!`);
    } else {
      alert(`Đã lưu và phát đề thi Khối ${grade} vĩnh viễn lên Google Sheets thành công!`);
    }
  } catch (err) {
    console.error('Lỗi gửi:', err);
    if (typeof showToast === 'function') {
      showToast(`Đã lưu tạm đề thi Khối ${grade} vào bộ nhớ máy!`, false);
    } else {
      alert(`Đã lưu tạm đề thi Khối ${grade} vào bộ nhớ máy!`);
    }
  }
}

function setAdminInputsDisabled(disabled) {
  ['adminExamTitle', 'examTitleInput', 'latexP1Input', 'latexP2Input', 'latexP3Input'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.disabled = disabled;
      el.style.opacity = disabled ? '0.5' : '1';
    }
  });
}

async function loadExamFromSheets(targetGrade) {
  const select = document.getElementById('adminGradeSelect');
  const grade = targetGrade || (select ? select.value : currentGrade) || '12';
  const loader = document.getElementById('adminExamLoading');

  if (loader) loader.classList.remove('d-none');
  setAdminInputsDisabled(true);

  try {
    const res = await fetch(SCRIPT_URL + '?action=getExam&grade=' + grade);
    const data = await res.json();

    if (data && (data.status === 'success' || data.part1 || data.part2 || data.part3 || data.p1 || data.p2 || data.p3 || data.tenDe || data.title)) {
      const p1 = data.part1 || data.p1 || "";
      const p2 = data.part2 || data.p2 || "";
      const p3 = data.part3 || data.p3 || "";
      const tenDe = data.tenDe || data.title || data.ten_de || `Đề Thi Kiểm Tra Môn Toán - Khối ${grade}`;

      if (document.getElementById('latexP1Input')) document.getElementById('latexP1Input').value = p1;
      if (document.getElementById('latexP2Input')) document.getElementById('latexP2Input').value = p2;
      if (document.getElementById('latexP3Input')) document.getElementById('latexP3Input').value = p3;
      setAdminExamTitle(tenDe);

      if (typeof renderExam === 'function') {
        renderExam(p1, p2, p3, tenDe);
      }
      return;
    }
  } catch (err) {
    console.log(`Chưa lấy được đề Khối ${grade} từ Sheets, đọc từ LocalStorage:`, err);
  } finally {
    if (loader) loader.classList.add('d-none');
    setAdminInputsDisabled(false);
  }

  let p1 = localStorage.getItem(`lms_p1_${grade}`) || localStorage.getItem('lms_p1') || '';
  let p2 = localStorage.getItem(`lms_p2_${grade}`) || localStorage.getItem('lms_p2') || '';
  let p3 = localStorage.getItem(`lms_p3_${grade}`) || localStorage.getItem('lms_p3') || '';
  let tenDe = `Đề Thi Kiểm Tra Môn Toán - Khối ${grade}`;

  const storedLatex = localStorage.getItem(`math_lms_latex_${grade}`);
  if (storedLatex) {
    try {
      const parsedObj = JSON.parse(storedLatex);
      if (parsedObj.part1) p1 = parsedObj.part1;
      if (parsedObj.part2) p2 = parsedObj.part2;
      if (parsedObj.part3) p3 = parsedObj.part3;
      if (parsedObj.tenDe || parsedObj.title) tenDe = parsedObj.tenDe || parsedObj.title;
    } catch(e) {}
  }

  if (document.getElementById('latexP1Input')) document.getElementById('latexP1Input').value = p1;
  if (document.getElementById('latexP2Input')) document.getElementById('latexP2Input').value = p2;
  if (document.getElementById('latexP3Input')) document.getElementById('latexP3Input').value = p3;
  setAdminExamTitle(tenDe);

  if (typeof renderExam === 'function') {
    renderExam(p1, p2, p3, tenDe);
  }
}

function renderExam(p1, p2, p3, title) {
  const displayTitle = title || `Đề Thi Kiểm Tra Môn Toán - Khối ${currentGrade}`;
  let p1Questions = (p1 && p1.trim()) ? parseLaTeXExam(p1, 1) : [];
  let p2Questions = (p2 && p2.trim()) ? parseLaTeXExam(p2, 2) : [];
  let p3Questions = (p3 && p3.trim()) ? parseLaTeXExam(p3, 3) : [];

  const combined = [...p1Questions, ...p2Questions, ...p3Questions];
  combined.forEach((q, idx) => { q.id = idx + 1; });

  currentExam = { title: displayTitle, questions: combined };
  localStorage.setItem('math_lms_exam', JSON.stringify(currentExam));

  if (document.getElementById('activeExamTitle')) document.getElementById('activeExamTitle').innerText = displayTitle;
  renderQuestionsList();
}

// Alias for backward compatibility
const fetchExamFromSheet = loadExamFromSheets;

async function saveAndPublishExam() {
  const tenDe = getAdminExamTitle();
  const latexP1 = document.getElementById('latexP1Input').value.trim();
  const latexP2 = document.getElementById('latexP2Input').value.trim();
  const latexP3 = document.getElementById('latexP3Input').value.trim();
  const isShuffle = document.getElementById('shuffleExamCheckbox').checked;

  if (!tenDe) {
    showToast("Vui lòng nhập Tên Đề Thi!", false);
    return;
  }

  if (!latexP1 && !latexP2 && !latexP3) {
    showToast("Vui lòng dán mã LaTeX vào ít nhất một phần đề thi!", false);
    return;
  }

  let p1Questions = (latexP1 && latexP1.trim()) ? parseLaTeXExam(latexP1, 1) : [];
  let p2Questions = (latexP2 && latexP2.trim()) ? parseLaTeXExam(latexP2, 2) : [];
  let p3Questions = (latexP3 && latexP3.trim()) ? parseLaTeXExam(latexP3, 3) : [];

  if (p1Questions.length === 0 && p2Questions.length === 0 && p3Questions.length === 0) {
    showToast("Không tìm thấy câu hỏi hợp lệ! Kiểm tra cú pháp \\begin{ex}...", false);
    return;
  }

  // Perform Fisher-Yates Shuffle if Checkbox is enabled
  if (isShuffle) {
    if (p1Questions.length > 0) {
      p1Questions = shuffleArray(p1Questions);
      p1Questions.forEach(q => {
        if (q.options && q.options.length > 0) {
          const correctOptText = (q.correctIndex >= 0 && q.correctIndex < q.options.length)
            ? q.options[q.correctIndex].text
            : null;

          q.options = shuffleArray(q.options);

          const labels = ['A', 'B', 'C', 'D'];
          let newCorrectIndex = -1;
          q.options.forEach((opt, idx) => {
            opt.label = labels[idx] || String.fromCharCode(65 + idx);
            if (correctOptText !== null && opt.text === correctOptText) {
              newCorrectIndex = idx;
            }
          });
          q.correctIndex = newCorrectIndex;
        }
      });
    }

    if (p2Questions.length > 0) p2Questions = shuffleArray(p2Questions);
    if (p3Questions.length > 0) p3Questions = shuffleArray(p3Questions);
  }

  const combinedQuestions = [...p1Questions, ...p2Questions, ...p3Questions];
  combinedQuestions.forEach((q, idx) => { q.id = idx + 1; });

  currentExam = { title: tenDe, questions: combinedQuestions };

  // Render on screen immediately
  if (document.getElementById('activeExamTitle')) document.getElementById('activeExamTitle').innerText = tenDe;
  renderQuestionsList();
  triggerRender();

  // Save to Google Sheets with URLSearchParams & fallback to localStorage
  await saveExamToSheets(latexP1, latexP2, latexP3);
}

// --- 9. STUDENT EXAM RENDERING ---
function loadExamForStudent(grade) {
  let targetGrade = grade;
  if (currentUser && currentUser.type === 'student') {
    targetGrade = getStudentGrade(currentUser.lop);
  } else if (!targetGrade) {
    targetGrade = currentGrade || '12';
  }

  switchStudentGrade(targetGrade);

  document.getElementById('resultRenderContainer').style.display = 'none';
  document.getElementById('examActiveContainer').style.display = 'block';

  const noticeEl = document.getElementById('studentGradeNotice');
  if (currentUser && currentUser.type === 'student') {
    const studentGrade = getStudentGrade(currentUser.lop);
    document.getElementById('activeStudentDetail').innerText = `Học sinh: ${currentUser.hoTen} (${currentUser.maHS}) | Lớp: ${currentUser.lop}`;
    if (noticeEl) {
      noticeEl.style.display = 'inline-flex';
      noticeEl.innerHTML = `<i class="fa-solid fa-lock"></i> Đề thi dành riêng cho Khối ${studentGrade} (Lớp ${currentUser.lop})`;
    }
  } else {
    document.getElementById('activeStudentDetail').innerText = currentUser
      ? `Tài khoản: ${currentUser.hoTen}`
      : `Vui lòng đăng nhập để nộp bài và nhận điểm số!`;
    if (noticeEl) noticeEl.style.display = 'none';
  }
}

function renderQuestionsList() {
  const container = document.getElementById('questionsRenderContainer');
  container.innerHTML = '';

  if (!currentExam || !currentExam.questions || currentExam.questions.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 50px 20px; color: var(--text-muted);">
        <i class="fa-solid fa-file-circle-xmark fa-3x" style="color: #cbd5e1; margin-bottom: 14px;"></i>
        <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-main);">Hiện chưa có đề thi cho khối này.</h3>
        <p style="font-size: 0.88rem; margin-top: 4px;">Giáo viên/Admin chưa phát đề thi cho khối này hoặc đề đang được cập nhật.</p>
      </div>
    `;
    return;
  }

  const part1Questions = currentExam.questions.filter(q => q.part === 1 || q.type === 'choice');
  const part2Questions = currentExam.questions.filter(q => q.part === 2 || q.type === 'choiceTF');
  const part3Questions = currentExam.questions.filter(q => q.part === 3 || q.type === 'shortans');

  let globalIndex = 0;

  // --- PHẦN I ---
  if (part1Questions.length > 0) {
    const p1Header = document.createElement('div');
    p1Header.className = 'part-header';
    p1Header.innerHTML = `
          <div class="part-title">PHẦN I. Câu hỏi trắc nghiệm nhiều lựa chọn</div>
          <div class="part-sub">Thí sinh trả lời từ câu 1 đến câu ${part1Questions.length}. Mỗi câu hỏi thí sinh chỉ chọn một phương án. (Mỗi câu đúng 0.25 điểm)</div>
        `;
    container.appendChild(p1Header);

    part1Questions.forEach(q => {
      globalIndex++;
      container.appendChild(createQuestionCard(q, globalIndex));
    });
  }

  // --- PHẦN II ---
  if (part2Questions.length > 0) {
    const p2Header = document.createElement('div');
    p2Header.className = 'part-header';
    p2Header.innerHTML = `
          <div class="part-title">PHẦN II. Câu hỏi trắc nghiệm Đúng/Sai</div>
          <div class="part-sub">Thí sinh trả lời từ câu 1 đến câu ${part2Questions.length}. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn Đúng hoặc Sai.</div>
        `;
    container.appendChild(p2Header);

    part2Questions.forEach(q => {
      globalIndex++;
      container.appendChild(createQuestionCard(q, globalIndex));
    });
  }

  // --- PHẦN III ---
  if (part3Questions.length > 0) {
    const p3Header = document.createElement('div');
    p3Header.className = 'part-header';
    p3Header.innerHTML = `
          <div class="part-title">PHẦN III. Câu hỏi trắc nghiệm trả lời ngắn</div>
          <div class="part-sub">Thí sinh trả lời từ câu 1 đến câu ${part3Questions.length}. (Mỗi câu đúng 0.5 điểm)</div>
        `;
    container.appendChild(p3Header);

    part3Questions.forEach(q => {
      globalIndex++;
      container.appendChild(createQuestionCard(q, globalIndex));
    });
  }

  // Kích hoạt render MathJax & TikZJax ngay sau khi chèn HTML vào DOM
  triggerRender();
}

function createQuestionCard(q, displayNum) {
  const card = document.createElement('div');
  card.className = 'question-card';

  let typeBadge = '';
  let bodyHtml = '';

  if (q.type === 'choice') {
    typeBadge = '<span class="type-badge badge-p1">Phần I - Trắc nghiệm</span>';
    bodyHtml = `
          <div class="options-grid grid-2col">
            ${q.options.map((opt, oIdx) => `
              <label class="option-label choice-item" onclick="selectChoice(${q.id}, ${oIdx})">
                <input type="radio" name="q_${q.id}" value="${oIdx}">
                <div><strong>${opt.label}.</strong> ${opt.text}</div>
              </label>
            `).join('')}
          </div>
        `;
  } else if (q.type === 'choiceTF') {
    typeBadge = '<span class="type-badge badge-p2">Phần II - Đúng/Sai</span>';
    bodyHtml = `
          <table class="tf-table">
            <tbody>
              ${q.statements.map((s, sIdx) => `
                <tr class="tf-row">
                  <td><strong>${s.label})</strong> ${s.text}</td>
                  <td>
                    <div class="tf-btn-group">
                      <button type="button" class="tf-btn" id="tf_${q.id}_${sIdx}_true" onclick="selectTF(${q.id}, ${sIdx}, true)">Đúng</button>
                      <button type="button" class="tf-btn" id="tf_${q.id}_${sIdx}_false" onclick="selectTF(${q.id}, ${sIdx}, false)">Sai</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
  } else if (q.type === 'shortans') {
    typeBadge = '<span class="type-badge badge-p3">Phần III - Trả lời ngắn</span>';
    bodyHtml = `
          <div style="margin-top: 10px;">
            <input type="text" class="form-control" placeholder="Nhập câu trả lời..." onchange="inputShortAns(${q.id}, this.value)">
          </div>
        `;
  }

  card.innerHTML = `
        <div class="question-top">
          <div class="question-num"><i class="fa-solid fa-circle-question"></i> Câu ${displayNum}</div>
          ${typeBadge}
        </div>
        <div class="question-stem">${q.stem}</div>
        ${bodyHtml}
      `;

  return card;
}

// --- 10. INTERACTIVE ANSWERS ---
function selectChoice(qId, oIdx) { studentAnswers[qId] = oIdx; }

function selectTF(qId, sIdx, val) {
  if (!studentAnswers[qId]) studentAnswers[qId] = {};
  studentAnswers[qId][sIdx] = val;

  const btnTrue = document.getElementById(`tf_${qId}_${sIdx}_true`);
  const btnFalse = document.getElementById(`tf_${qId}_${sIdx}_false`);

  if (val === true) {
    btnTrue.className = 'tf-btn active-true';
    btnFalse.className = 'tf-btn';
  } else {
    btnTrue.className = 'tf-btn';
    btnFalse.className = 'tf-btn active-false';
  }
}

function inputShortAns(qId, val) {
  studentAnswers[qId] = val.trim().replace(',', '.');
}

// --- 11. SUBMISSION & MINISTRY SCORING RULE ---
function submitExam() {
  if (!currentUser || currentUser.type !== 'student') {
    showToast("Vui lòng đăng nhập tài khoản học sinh trước khi nộp bài!", false);
    switchNavTab('auth');
    return;
  }

  if (!confirm("Bạn có chắc chắn muốn nộp bài thi?")) return;

  let diemP1 = 0;
  let diemP2 = 0;
  let diemP3 = 0;

  const reviewList = [];

  currentExam.questions.forEach(q => {
    if (q.type === 'choice') {
      const userAns = studentAnswers[q.id];
      const isCorrect = (userAns !== undefined && userAns === q.correctIndex);
      const earned = isCorrect ? 0.25 : 0;
      diemP1 += earned;
      reviewList.push({ question: q, userAns, isCorrect, earned, max: 0.25 });

    } else if (q.type === 'choiceTF') {
      const userTF = studentAnswers[q.id] || {};
      let correctCount = 0;

      q.statements.forEach((s, sIdx) => {
        if (userTF[sIdx] !== undefined && userTF[sIdx] === s.correct) {
          correctCount++;
        }
      });

      let earned = 0;
      if (correctCount === 1) earned = 0.10;
      else if (correctCount === 2) earned = 0.25;
      else if (correctCount === 3) earned = 0.50;
      else if (correctCount === 4) earned = 1.00;

      diemP2 += earned;
      reviewList.push({ question: q, userAns: userTF, correctCount, earned, max: 1.00 });

    } else if (q.type === 'shortans') {
      const userAns = (studentAnswers[q.id] || "").trim().replace(',', '.');
      const normCorrect = String(q.correctAnswer).trim().replace(',', '.');
      const isCorrect = (userAns !== "" && userAns === normCorrect);
      const earned = isCorrect ? 0.50 : 0;
      diemP3 += earned;
      reviewList.push({ question: q, userAns, isCorrect, earned, max: 0.50 });
    }
  });

  diemP1 = Math.round(diemP1 * 100) / 100;
  diemP2 = Math.round(diemP2 * 100) / 100;
  diemP3 = Math.round(diemP3 * 100) / 100;
  const tongDiem = Math.round((diemP1 + diemP2 + diemP3) * 100) / 100;

  // Post result to Google Apps Script
  postResultToServer(diemP1, diemP2, diemP3, tongDiem);

  // Render Result Screen
  renderResultScreen(diemP1, diemP2, diemP3, tongDiem, reviewList);
}

async function postResultToServer(diemP1, diemP2, diemP3, tongDiem) {
  const payload = {
    maHS: currentUser.maHS,
    hoTen: currentUser.hoTen,
    lop: currentUser.lop,
    tenDe: currentExam.title,
    diemP1: diemP1,
    diemP2: diemP2,
    diemP3: diemP3,
    tongDiem: tongDiem
  };

  try {
    await fetch(WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
    showToast("Đã lưu kết quả bài thi thành công!");
  } catch (err) {
    console.error("Lỗi gửi điểm số:", err);
    showToast("Lưu kết quả bài thi cục bộ thành công");
  }
}

// --- 12. RENDER DETAILED SOLUTION REVIEW ---
function renderResultScreen(p1, p2, p3, total, reviewList) {
  document.getElementById('resP1').innerText = p1.toFixed(2);
  document.getElementById('resP2').innerText = p2.toFixed(2);
  document.getElementById('resP3').innerText = p3.toFixed(2);
  document.getElementById('resTotal').innerText = total.toFixed(2);

  document.getElementById('resultExamTitle').innerText = currentExam.title;
  document.getElementById('resultStudentInfo').innerText = `${currentUser.hoTen} (${currentUser.maHS}) - Lớp ${currentUser.lop}`;

  const container = document.getElementById('resultQuestionsList');
  container.innerHTML = '';

  reviewList.forEach((res, idx) => {
    const q = res.question;
    const qCard = document.createElement('div');
    qCard.className = 'question-card';

    let scoreBadge = '';
    if (res.earned === res.max) {
      scoreBadge = `<span class="status-correct"><i class="fa-solid fa-circle-check"></i> +${res.earned.toFixed(2)} / ${res.max.toFixed(2)} điểm</span>`;
    } else if (res.earned > 0) {
      scoreBadge = `<span class="status-partial"><i class="fa-solid fa-circle-half-stroke"></i> +${res.earned.toFixed(2)} / ${res.max.toFixed(2)} điểm</span>`;
    } else {
      scoreBadge = `<span class="status-incorrect"><i class="fa-solid fa-circle-xmark"></i> 0 / ${res.max.toFixed(2)} điểm</span>`;
    }

    let answerHtml = '';

    if (q.type === 'choice') {
      answerHtml = `
            <div class="options-grid grid-2col">
              ${q.options.map((opt, oIdx) => {
        let border = 'border: 1px solid var(--border-color);';
        let tag = '';

        if (oIdx === q.correctIndex) {
          border = 'border: 2px solid #16a34a; background: #f0fdf4;';
          tag = ' <i class="fa-solid fa-check status-correct"></i> (Đáp án đúng)';
        }
        if (res.userAns === oIdx && oIdx !== q.correctIndex) {
          border = 'border: 2px solid #dc2626; background: #fef2f2;';
          tag = ' <i class="fa-solid fa-xmark status-incorrect"></i> (Bạn chọn)';
        }

        return `<div class="choice-item" style="padding: 10px 14px; ${border}"><strong>${opt.label}.</strong> ${opt.text} ${tag}</div>`;
      }).join('')}
            </div>
          `;
    } else if (q.type === 'choiceTF') {
      const userObj = res.userAns || {};
      answerHtml = `
            <table class="tf-table">
              <tbody>
                ${q.statements.map((s, sIdx) => {
        const uVal = userObj[sIdx];
        const isRight = uVal === s.correct;
        let info = '';

        if (uVal === undefined) info = `<span style="color: var(--text-muted);">(Chưa chọn - Đáp án: ${s.correct ? 'Đúng' : 'Sai'})</span>`;
        else if (isRight) info = `<span class="status-correct"><i class="fa-solid fa-check"></i> Bạn chọn ${uVal ? 'Đúng' : 'Sai'} (Đúng)</span>`;
        else info = `<span class="status-incorrect"><i class="fa-solid fa-xmark"></i> Bạn chọn ${uVal ? 'Đúng' : 'Sai'} (Đáp án đúng: ${s.correct ? 'Đúng' : 'Sai'})</span>`;

        return `<tr class="tf-row"><td><strong>${s.label})</strong> ${s.text}</td><td>${info}</td></tr>`;
      }).join('')}
              </tbody>
            </table>
          `;
    } else if (q.type === 'shortans') {
      answerHtml = `
            <div style="padding: 12px 16px; background: #f8fafc; border-radius: 8px; border: 1px solid var(--border-color);">
              <p>Câu trả lời của bạn: <strong>${res.userAns || '(Bỏ trống)'}</strong></p>
              <p>Đáp án chính xác: <strong class="status-correct">${q.correctAnswer}</strong></p>
            </div>
          `;
    }

    let solutionHtml = '';
    if (q.loigiai) {
      solutionHtml = `
            <div class="solution-box">
              <div class="solution-title"><i class="fa-solid fa-lightbulb"></i> Lời Giải Chi Tiết:</div>
              <div>${q.loigiai}</div>
            </div>
          `;
    }

    qCard.innerHTML = `
          <div class="question-top">
            <div class="question-num">Câu ${idx + 1}</div>
            <div>${scoreBadge}</div>
          </div>
          <div class="question-stem">${q.stem}</div>
          ${answerHtml}
          ${solutionHtml}
        `;

    container.appendChild(qCard);
  });

  document.getElementById('examActiveContainer').style.display = 'none';
  document.getElementById('resultRenderContainer').style.display = 'block';
  triggerRender();
}

// --- 13. INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
  updateHeaderUI();
  fetchNewsFromSheet();
  fetchDocsFromSheet();
  loadExamFromSheets();
  checkUrlRoute();
  window.addEventListener('popstate', checkUrlRoute);
  window.addEventListener('hashchange', checkUrlRoute);
});
