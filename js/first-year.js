const courseList = document.getElementById("course-list");
const calculateBtn = document.getElementById("calculate-btn");
const resetBtn = document.getElementById("reset-btn");
const formError = document.getElementById("form-error");
const resultModal = document.getElementById("result-modal");
const closeModal = document.getElementById("close-modal");
const modalSemesterGpa = document.getElementById("modal-semester-gpa");
const modalSemesterEmoji = document.getElementById("modal-semester-emoji");
const modalRegisteredHours = document.getElementById("modal-registered-hours");
const modalCompletedHours = document.getElementById("modal-completed-hours");
const modalCumulativeGpa = document.getElementById("modal-cumulative-gpa");
const modalCumulativeEmoji = document.getElementById("modal-cumulative-emoji");
const modalTotalCompletedHours = document.getElementById(
  "modal-total-completed-hours",
);

function getEmoji(gpa) {
  if (gpa >= 90) return "🫡🐐";
  if (gpa >= 80) return "😎🔥";
  if (gpa >= 70) return "🙂👍";
  if (gpa >= 60) return "🫣👎";
  return "😢💔";
}

function showError(message) {
  formError.textContent = message;
  formError.classList.remove("hidden");
}

function clearError() {
  formError.textContent = "";
  formError.classList.add("hidden");
}

function formatNumber(value) {
  return Number.isFinite(value) ? value.toFixed(2).replace(".00", "") : "-";
}

function calculateGpa() {
  clearError();

  const courseRows = courseList.querySelectorAll(".course-row");
  let totalRegisteredHours = 0;
  let totalSemesterCompletedHours = 0;
  let totalSemesterPoints = 0;
  let filledRows = 0;

  for (const row of courseRows) {
    const hoursInput = row.querySelector(".course-hours");
    const gradeInput = row.querySelector(".course-grade");

    const hoursValue = hoursInput.value.trim();
    const gradeValue = gradeInput.value.trim();

    const hours = parseInt(hoursValue, 10);
    const grade = parseFloat(gradeValue);

    // Skip completely empty rows
    if (
      (hoursValue === "" || Number.isNaN(hours)) &&
      (gradeValue === "" || Number.isNaN(grade))
    ) {
      continue;
    }

    // Validate partially filled rows
    if (hoursValue === "" || Number.isNaN(hours) || hours <= 0) {
      showError("أكمل بيانات المادة: الساعات مطلوبة ويجب أن تكون أكبر من صفر.");
      return;
    }

    if (gradeValue === "" || Number.isNaN(grade) || grade < 50 || grade > 100) {
      showError("أكمل بيانات المادة: الدرجة مطلوبة ويجب أن تكون بين ٥٠ و ١٠٠.");
      return;
    }

    // Valid row
    filledRows++;
    totalRegisteredHours += hours;

    // Semester GPA calculation: based on current grades
    if (grade >= 60) {
      totalSemesterCompletedHours += hours;
      totalSemesterPoints += grade * hours;
    }
  }

  if (filledRows === 0) {
    showError("يجب ملء مادة واحدة على الأقل قبل الحساب.");
    return;
  }

  const semesterGpa =
    totalSemesterCompletedHours === 0
      ? 0
      : totalSemesterPoints / totalSemesterCompletedHours;
  // For first-year, cumulative GPA is the same as semester GPA
  const cumulativeGpa = semesterGpa;
  const totalCumulativeHours = totalSemesterCompletedHours;

  // Update modal
  modalSemesterGpa.textContent = formatNumber(semesterGpa);
  modalSemesterEmoji.textContent = getEmoji(semesterGpa);
  modalRegisteredHours.textContent = totalRegisteredHours;
  modalCompletedHours.textContent = totalSemesterCompletedHours;
  modalCumulativeGpa.textContent = formatNumber(cumulativeGpa);
  modalCumulativeEmoji.textContent = getEmoji(cumulativeGpa);
  modalTotalCompletedHours.textContent = totalCumulativeHours;

  // Show modal
  resultModal.classList.remove("hidden");
}

function resetForm() {
  const allInputs = courseList.querySelectorAll("input");
  allInputs.forEach((input) => (input.value = ""));
  clearError();
  resultModal.classList.add("hidden");
}

function closeModalHandler() {
  resultModal.classList.add("hidden");
}

calculateBtn.addEventListener("click", calculateGpa);
resetBtn.addEventListener("click", resetForm);
closeModal.addEventListener("click", closeModalHandler);

resultModal.addEventListener("click", (e) => {
  if (e.target === resultModal) {
    closeModalHandler();
  }
});

window.addEventListener("DOMContentLoaded", () => {
  // Form is ready
});
