import { apiClient } from "./api.js";
import { elements } from "./domElements.js";

function openUserManagementModal() {
  elements.userManagementModal?.classList.remove("hidden");
}

function closeUserManagementModal() {
  elements.userManagementModal?.classList.add("hidden");
}

function setUserListMessage(message) {
  if (!elements.userManagementList) return;
  const paragraph = document.createElement("p");
  paragraph.textContent = message;
  elements.userManagementList.innerHTML = "";
  elements.userManagementList.appendChild(paragraph);
}

function renderUsers(users = []) {
  if (!elements.userManagementList) return;
  if (!users.length) {
    setUserListMessage("ユーザーが登録されていません。");
    return;
  }
  const table = document.createElement("table");
  table.className = "user-table";
  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th>ID</th>
      <th>ユーザー名</th>
      <th>権限</th>
      <th>作成日</th>
      <th>操作</th>
    </tr>
  `;
  const tbody = document.createElement("tbody");
  users.forEach((user) => {
    const row = document.createElement("tr");
    const roleLabel = user.is_admin ? "管理者" : "一般";
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.username}</td>
      <td>${roleLabel}</td>
      <td>${user.created_at ?? "-"}</td>
      <td class="actions"></td>
    `;
    const actionsCell = row.querySelector(".actions");
    if (actionsCell) {
      const toggleButton = document.createElement("button");
      toggleButton.type = "button";
      toggleButton.dataset.action = "toggle-admin";
      toggleButton.dataset.userId = String(user.id);
      toggleButton.dataset.isAdmin = user.is_admin ? "true" : "false";
      toggleButton.className = "user-action-button outline";
      toggleButton.innerHTML = `<span>${
        user.is_admin ? "管理者解除" : "管理者付与"
      }</span>`;
      actionsCell.appendChild(toggleButton);

      const passwordButton = document.createElement("button");
      passwordButton.type = "button";
      passwordButton.dataset.action = "reset-password";
      passwordButton.dataset.userId = String(user.id);
      passwordButton.dataset.username = user.username;
      passwordButton.className = "user-action-button";
      passwordButton.innerHTML = "<span>パスワード変更</span>";
      actionsCell.appendChild(passwordButton);

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.dataset.action = "delete";
      deleteButton.dataset.userId = String(user.id);
      deleteButton.dataset.username = user.username;
      deleteButton.className = "user-action-button danger";
      deleteButton.innerHTML = "<span>削除</span>";
      actionsCell.appendChild(deleteButton);
    }
    tbody.appendChild(row);
  });
  table.appendChild(thead);
  table.appendChild(tbody);
  elements.userManagementList.innerHTML = "";
  elements.userManagementList.appendChild(table);
}

async function refreshUsers() {
  setUserListMessage("ユーザー情報を読み込んでいます...");
  try {
    const response = await apiClient.get("/api/admin/users");
    renderUsers(response.data?.users || []);
  } catch (error) {
    console.error("Failed to fetch users", error);
    setUserListMessage("ユーザー情報の取得に失敗しました。");
  }
}

async function handleCreateUser(event) {
  event.preventDefault();
  if (!elements.userCreateForm || !elements.newUserName || !elements.newUserPassword) {
    return;
  }
  const username = elements.newUserName.value.trim();
  const password = elements.newUserPassword.value;
  const isAdmin = Boolean(elements.newUserIsAdmin?.checked);
  if (!username || !password) {
    alert("ユーザー名とパスワードを入力してください。");
    return;
  }
  try {
    await apiClient.post("/api/admin/users", {
      username,
      password,
      is_admin: isAdmin,
    });
    elements.userCreateForm.reset();
    refreshUsers();
  } catch (error) {
    console.error("Failed to create user", error);
    alert(error.response?.data?.detail || "ユーザーの作成に失敗しました。");
  }
}

async function handleListAction(event) {
  if (!(event.target instanceof Element)) return;
  const target = event.target.closest("button[data-action]");
  if (!target) return;
  const userId = Number(target.dataset.userId);
  if (!userId) return;
  const action = target.dataset.action;
  try {
    if (action === "delete") {
      const username = target.dataset.username || "";
      if (!confirm(`${username} を削除しますか？`)) return;
      await apiClient.delete(`/api/admin/users/${userId}`);
    } else if (action === "reset-password") {
      const username = target.dataset.username || "";
      const newPassword = prompt(`${username} の新しいパスワードを入力してください`);
      if (!newPassword) return;
      await apiClient.put(`/api/admin/users/${userId}`, { password: newPassword });
    } else if (action === "toggle-admin") {
      const current = target.dataset.isAdmin === "true";
      await apiClient.put(`/api/admin/users/${userId}`, { is_admin: !current });
    }
    refreshUsers();
  } catch (error) {
    console.error("Failed to update user", error);
    alert(error.response?.data?.detail || "ユーザー情報の更新に失敗しました。");
  }
}

export function setupUserManagement() {
  if (!elements.userManagementButton || !elements.userManagementModal) return;
  elements.userManagementButton.addEventListener("click", () => {
    openUserManagementModal();
    refreshUsers();
  });
  elements.userManagementClose?.addEventListener("click", closeUserManagementModal);
  elements.userManagementModal.addEventListener("click", (event) => {
    if (event.target === elements.userManagementModal) {
      closeUserManagementModal();
    }
  });
  elements.userCreateForm?.addEventListener("submit", handleCreateUser);
  elements.userManagementList?.addEventListener("click", handleListAction);
}
