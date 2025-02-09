let currentQuestionIndex = 0;
let questions = [];

// Đọc file TSV sử dụng fetch
fetch('data.tsv')  // Sửa thành 'data.tsv' để tải file TSV
    .then(response => response.text())
    .then(data => {
        parseTSV(data);
        displayQuestion();
    })
    .catch(error => console.error('Error reading the TSV file:', error));

// Hàm phân tích dữ liệu TSV, loại bỏ dòng tiêu đề và trường giải thích
function parseTSV(data) {
    const lines = data.split('\n');
    const parsedData = [];

    lines.forEach((line, index) => {
        // Loại bỏ dòng tiêu đề (dòng đầu tiên)
        if (index === 0) return;

        const fields = line.split('\t');  // Sử dụng tab (\t) để phân tách các trường

        // Kiểm tra số lượng trường hợp hợp lệ
        if (fields.length === 7) { // Bỏ trường giải thích
            const question = {
                STT: fields[0], // Số thứ tự câu hỏi
                Cauhoi: fields[1], // Câu hỏi
                Dapan1: fields[2],
                Dapan2: fields[3],
                Dapan3: fields[4],
                Dapan4: fields[5],
                Dapan: parseInt(fields[6]) // Chuyển đáp án đúng thành số
            };
            parsedData.push(question);
        } else {
            console.log("Dòng lỗi: ", line); // Log các dòng bị lỗi
        }
    });

    questions = parsedData; // Lưu lại dữ liệu câu hỏi
    console.log(questions); // Log tất cả câu hỏi để kiểm tra
}

// Hiển thị câu hỏi
function displayQuestion() {
    if (questions.length === 0) return;

    const question = questions[currentQuestionIndex];
    document.getElementById("question").textContent = question.Cauhoi;
    document.getElementById("stt").textContent = question.STT; // Hiển thị số thứ tự câu hỏi

    const answerButtons = document.querySelectorAll(".answer-btn");

    answerButtons[0].textContent = question.Dapan1;
    answerButtons[1].textContent = question.Dapan2;
    answerButtons[2].textContent = question.Dapan3;
    answerButtons[3].textContent = question.Dapan4;

    // Đặt lại màu sắc và trạng thái nút
    answerButtons.forEach(button => button.style.backgroundColor = "#f9f9f9");
    answerButtons.forEach(button => button.disabled = false);
    
    document.getElementById("next-btn").disabled = false;
    document.getElementById("back-btn").disabled = currentQuestionIndex === 0;
}

// Kiểm tra đáp án
function checkAnswer(selectedAnswer) {
    const correctAnswer = questions[currentQuestionIndex].Dapan;
    const answerButtons = document.querySelectorAll(".answer-btn");

    answerButtons.forEach((button, index) => {
        if (index + 1 === correctAnswer) {
            button.style.backgroundColor = "green"; // Màu xanh cho đáp án đúng
            button.style.color = "white"; // Màu chữ trắng cho đáp án đúng
        } else {
            button.style.backgroundColor = index + 1 === selectedAnswer ? "red" : "#f9f9f9"; // Màu đỏ cho đáp án sai
            button.style.color = index + 1 === selectedAnswer ? "white" : "black"; // Màu chữ trắng cho đáp án sai và đen cho các đáp án khác
        }
        button.disabled = true; // Khóa không cho click lại
    });

    document.getElementById("next-btn").disabled = false; // Kích hoạt nút Next
}

// Di chuyển qua các câu hỏi
function navigate(direction) {
    currentQuestionIndex += direction;

    if (currentQuestionIndex >= questions.length) {
        currentQuestionIndex = questions.length - 1;
        alert("Bạn đã trả lời xong tất cả câu hỏi!");
        return;
    }

    if (currentQuestionIndex < 0) {
        currentQuestionIndex = 0;
        return;
    }

    displayQuestion();
}
