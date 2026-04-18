const previousGpaInput = document.getElementById("previous-gpa");
const previousHoursInput = document.getElementById("previous-hours");
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

  const previousGpa = parseFloat(previousGpaInput.value.trim());
  const previousHours = parseInt(previousHoursInput.value.trim(), 10);

  if (Number.isNaN(previousHours) || previousHours < 0) {
    showError("الرجاء إدخال عدد الساعات المنجزة السابقة صحيح وغير سالب.");
    return;
  }

  if (
    previousHours > 0 &&
    (Number.isNaN(previousGpa) || previousGpa < 0 || previousGpa > 100)
  ) {
    showError("عند وجود ساعات سابقة، أدخل معدلًا تراكميًا صحيحًا بين ٠ و ١٠٠.");
    return;
  }

  const courseRows = courseList.querySelectorAll(".course-row");
  let totalRegisteredHours = 0;
  let totalSemesterCompletedHours = 0;
  let totalSemesterPoints = 0;
  let totalCumulativeQP = Number.isFinite(previousGpa)
    ? previousGpa * previousHours
    : 0;
  let totalCumulativeHours = previousHours;
  let filledRows = 0;

  for (const row of courseRows) {
    const hoursInput = row.querySelector(".course-hours");
    const gradeInput = row.querySelector(".course-grade");
    const prevGradeInput = row.querySelector(".course-prev-grade");

    const hoursValue = hoursInput.value.trim();
    const gradeValue = gradeInput.value.trim();
    const prevGradeValue = prevGradeInput.value.trim();

    const hours = parseInt(hoursValue, 10);
    const grade = parseFloat(gradeValue);
    const prevGrade = parseFloat(prevGradeValue);

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

    // Validate previous grade if filled
    if (
      prevGradeValue !== "" &&
      (Number.isNaN(prevGrade) || prevGrade < 0 || prevGrade > 100)
    ) {
      showError(
        "إذا كانت المادة معادة، أدخل العلامة السابقة صحيحة بين ٠ و ١٠٠.",
      );
      return;
    }

    // Valid row
    filledRows++;
    totalRegisteredHours += hours;

    // Semester GPA calculation: always based on current grades
    if (grade >= 60) {
      totalSemesterCompletedHours += hours;
      totalSemesterPoints += grade * hours;
    }

    const isRepeated = prevGradeValue !== "" && !Number.isNaN(prevGrade);

    if (isRepeated) {
      // Repeated course: adjust quality points for cumulative, don't add hours
      const adjustment = (grade - prevGrade) * hours;
      totalCumulativeQP += adjustment;
    } else {
      // Non-repeated course: add to cumulative if passed
      if (grade >= 60) {
        totalCumulativeQP += grade * hours;
        totalCumulativeHours += hours;
      }
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
  const cumulativeGpa =
    totalCumulativeHours === 0 ? 0 : totalCumulativeQP / totalCumulativeHours;

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
  previousGpaInput.value = "";
  previousHoursInput.value = "";
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
