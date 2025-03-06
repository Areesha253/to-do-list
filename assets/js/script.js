var tasksURL = "includes/tasks.php";

var getTaskTemplate = (task) => ` 
    <li class="list-group-item" data-id="${task.id}">
        <div class="checkbox-with-task-text">
            <input type="checkbox" class="status-checkbox action-btn" 
            data-id="${task.id}" 
            ${task.status === "completed" ? "checked" : ""}>
            <span class="task-text">${task.task}</span>
        </div>
        ${task.status === "completed" ? '<span class="badge bg-success ms-2">Completed</span>' : ""}
            <button class="btn btn-sm btn-danger delete action-btn ms-2" data-id="${task.id}">
            <i class="fa-solid fa-trash"></i></button>
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

$("#taskList").on("click", ".delete", async function () {
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
      url: "includes/login.php",
      data: { username, password },
    });

    if (response.status === "success") {
      showToastAlert("Login successful! Redirecting...", { position: "center" });
      setTimeout(() => {
        window.location.href = "index.php";
      }, 2000);
    } else {
      showToastAlert(response.message, { backgroundColor: "red", position: "center" });
    }
  } catch (error) {
    console.error("AJAX Error:", error);
    showToastAlert("An error occurred during login. Please try again.", { backgroundColor: "red" });
  }
});

$(".logout-btn").on("click", function () {
  window.location.href = "includes/logout.php";
});
