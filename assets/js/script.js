var getTaskTemplate = (task) => `
    <li class="list-group-item d-flex justify-content-between align-items-center" data-id="${task.id}">
        ${task.task}
        ${task.status === "completed" ? '<span class="badge bg-success ms-2">Completed</span>' : ''}
        <div>
            <button class="btn btn-sm btn-success complete action-btn" data-id="${task.id}">✓</button>
            <button class="btn btn-sm btn-danger delete action-btn" data-id="${task.id}">✖</button>
        </div>
    </li>
`;

var loadTasks = async () => {
    try {
        let response = await $.getJSON("includes/functions.php");
        let taskList = response.map(getTaskTemplate).join("");
        $("#taskList").html(taskList);
    } catch (error) {
        console.error("Error loading tasks:", error);
        showToast("Failed to load tasks!", "red");
    }
};

var showToast = (message, backgroundColor) => {
    Toastify({
        text: message,
        duration: 2000,
        gravity: "top",
        position: "left",
        backgroundColor: backgroundColor,
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
        await $.post("includes/functions.php", { task: task });
        loadTasks();
        $("#taskInput").val("");
        showToast("Task Added Successfully", "green");
    } catch (error) {
        console.error("Error adding task:", error);
        showToast("Failed to add task!", "red");
    }
});

$("#taskList").on("click", ".complete", async function () {
    var taskItem = $(this).closest("li");
    var id = $(this).attr("data-id");
    disableButtons(taskItem);
    try {
        var response = await $.post("includes/functions.php", { Status: id });
        var data = JSON.parse(response)
        if (data.newStatus === 'completed') {
            showToast("Task Marked as Completed!", "green");
        } else {
            showToast("Task Marked as Not Completed!", "orange");
        }
        loadTasks();
    } catch (error) {
        showToast("Failed to mark task as completed!", "red");
    }
        enableButtons(taskItem);
});

$("#taskList").on("click", ".delete", async function () {
    var taskItem = $(this).closest("li");
    var id = $(this).attr("data-id");
    disableButtons(taskItem);
    try {
        await $.post("includes/functions.php", { delete: id });
        taskItem.remove();
        showToast("Task has been Deleted!", "purple");
    } catch (error) {
        showToast("Failed to delete task!", "red");
    }
        enableButtons(taskItem);
});

loadTasks();