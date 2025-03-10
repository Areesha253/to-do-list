var tasksURL = "includes/tasks.php";

var getTaskTemplate = (task) => ` 
    <li class="list-group-item" data-id="${task.id}">
        <span class="task-text">${task.task}</span>
        ${task.status === "completed" ? '<span class="badge bg-success ms-2">Completed</span>' : ""}
        <div class="checkbox-with-delete-btn">
        <input type="checkbox" class="status-checkbox action-btn" data-id="${task.id}" 
        ${task.status === "completed" ? "checked" : ""}>
        <i class="fa-solid fa-trash delete-btn action-btn" data-id="${task.id}"></i></div>
    </li>
`;
var loadTasks = async () => {
  if ($("#taskList").length === 0) return;
  try {
    var response = await $.ajax({
      url: tasksURL,
      method: "GET",
      data: { name: "get_all" },
    });
    var taskList = response.map(getTaskTemplate).join("");
    $("#taskList").html(taskList);
  } catch (error) {
    console.error("Error loading tasks:", error);
    showToastAlert("Failed to load tasks!", { backgroundColor: "red" });
  }
};

var showToastAlert = (message, options = {}) => {
  Toastify({
    text: message,
    duration: options.duration || 2000,
    gravity: options.gravity || "top",
    position: options.position || "left",
    backgroundColor: options.backgroundColor || "green",
  }).showToast();
};

var disableButtons = (taskItem) => {
  taskItem.find(".action-btn").prop("disabled", true);
};

var enableButtons = (taskItem) => {
  taskItem.find(".action-btn").prop("disabled", false);
};

$("#taskForm").on("submit", async (e) => {
  e.preventDefault();
  var task = $("#taskInput").val().trim();
  try {
    await $.ajax({
      url: tasksURL,
      method: "POST",
      data: { task },
    });
    loadTasks();
    $("#taskInput").val("");
    showToastAlert("Task Added Successfully");
  } catch (error) {
    console.error("Error adding task:", error);
    showToastAlert("Failed to add task!", { backgroundColor: "red" });
  }
});

$("#taskList").on("click", ".status-checkbox", async function () {
  var taskItem = $(this).closest("li");
  var id = $(this).attr("data-id");
  disableButtons(taskItem);
  try {
    var data = await $.ajax({
      url: tasksURL,
      method: "PATCH",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify({ id }),
    });
    if (data.newStatus === "completed") {
      showToastAlert("Task Marked as Completed!");
    } else {
      showToastAlert("Task Marked as Not Completed!", { backgroundColor: "orange" });
    }
    loadTasks();
  } catch (error) {
    showToastAlert("Failed to mark task as completed!", { backgroundColor: "red" });
  }
  enableButtons(taskItem);
});

$("#taskList").on("click", ".delete-btn", async function () {
  var taskItem = $(this).closest("li");
  var id = $(this).attr("data-id");
  disableButtons(taskItem);
  try {
    await $.ajax({
      url: tasksURL,
      method: "DELETE",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify({ id }),
    });
    taskItem.remove();
    showToastAlert("Task has been Deleted!", { backgroundColor: "purple" });
  } catch (error) {
    showToastAlert("Failed to delete task!", { backgroundColor: "red" });
  }
  enableButtons(taskItem);
});

loadTasks();

$("#user-login-form").on("submit", async function (e) {
  e.preventDefault();

  var username = $("#username").val();
  var password = $("#password").val();

  try {
    let response = await $.ajax({
      type: "POST",
      url: "includes/login_register.php",
      data: { name: "user_login", username, password },
    });

    if (response.status === "success") {
      window.location.href = "admin.php";
    } else {
      showToastAlert(response.message, { backgroundColor: "red" });
    }
  } catch (error) {
    console.error("AJAX Error:", error);
    showToastAlert("An error occurred during login. Please try again.", { backgroundColor: "red" });
  }
});
$("#user-registeration-form").on("submit", async function (e) {
  e.preventDefault();

  var username = $("#username").val();
  var password = $("#password").val();

  try {
    let response = await $.ajax({
      type: "POST",
      url: "includes/login_register.php",
      data: { name: "user_register", username, password },
      dataType: "json",
    });

    if (response.status === "success") {
      showToastAlert("Registration successful! Please Login to Continue", { backgroundColor: "green" });
      setTimeout(() => {
        window.location.href = "index.php";
      }, 3000);
    } else {
      showToastAlert(response.message, { backgroundColor: "red" });
    }
  } catch (error) {
    console.error("AJAX Error:", error);
    showToastAlert("An error occurred during registration. Please try again.", { backgroundColor: "red" });
  }
});
