export async function fetchProducts() {
  const res = await fetch("/api/products");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export async function fetchLeaderboard() {
  const res = await fetch("/api/leaderboard");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export async function fetchActivity() {
  const res = await fetch("/api/activity");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Login failed");
  }
  return res.json();
}

export async function fetchPages() {
  const res = await fetch("/api/pages");
  if (!res.ok) throw new Error("Failed to fetch pages");
  return res.json();
}

export async function syncGoogleSheets(sheetUrl?: string) {
  const res = await fetch("/api/sync-sheets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sheetUrl }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to sync Google Sheets");
  }
  return res.json();
}

export async function getSheetsSyncStatus() {
  const res = await fetch("/api/sync-sheets");
  if (!res.ok) throw new Error("Failed to get sync status");
  return res.json();
}

export async function fetchUsers() {
  const res = await fetch("/api/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function createUser(userData: { name: string; email: string; password: string; role?: string }) {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to create user");
  }
  return res.json();
}

export async function toggleBlockUser(id: number) {
  const res = await fetch(`/api/users/${id}/toggle-block`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to toggle block status");
  return res.json();
}

export async function deleteUser(id: number) {
  const res = await fetch(`/api/users/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete user");
  return res.json();
}

export async function updateUser(id: number, data: { name?: string; email?: string; password?: string; role?: string }) {
  const res = await fetch(`/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update user");
  }
  return res.json();
}

export async function savePage(slug: string, pageData: { title: string; subtitle?: string; content?: string; imageUrl?: string }) {
  const res = await fetch("/api/pages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug, pageData }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to save page");
  }
  return res.json();
}

export async function fetchNewsPosts() {
  try {
    const res = await fetch("/api/posts");
    if (!res.ok) throw new Error("Failed to fetch posts from API");
    return await res.json();
  } catch {
    const { FALLBACK_NEWS_POSTS } = await import("../data/fallbackNews");
    return FALLBACK_NEWS_POSTS;
  }
}

export async function saveNewsPost(post: any) {
  const res = await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to save post");
  }
  return res.json();
}

export async function fetchTelemetryLogs() {
  try {
    const res = await fetch("/api/telemetry");
    if (!res.ok) throw new Error("Failed to fetch telemetry");
    return await res.json();
  } catch {
    return [];
  }
}

export async function saveTelemetryLog(telemetry: any) {
  try {
    const res = await fetch("/api/telemetry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(telemetry)
    });
    return await res.json();
  } catch (e) {
    console.warn("Failed to post telemetry:", e);
    return null;
  }
}

export async function fetchPostSubmissions() {
  try {
    const res = await fetch("/api/post-submissions");
    if (!res.ok) throw new Error("Failed to fetch post submissions");
    return await res.json();
  } catch {
    return [];
  }
}

export async function submitPostForReviewApi(submission: any) {
  const res = await fetch("/api/post-submissions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(submission)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to submit post for review");
  }
  return await res.json();
}

export async function updatePostSubmission(id: string, status: "approved" | "rejected" | "deleted", reviewerEmail: string, feedback?: string) {
  const res = await fetch(`/api/post-submissions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, reviewerEmail, feedback })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update submission");
  }
  return await res.json();
}

export async function approveUserAccount(userId: number | string) {
  const res = await fetch(`/api/users/${userId}/approve`, {
    method: "POST"
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to approve user");
  }
  return await res.json();
}

export async function requestPostDeletionApi(id: string, reason: string, authorEmail?: string) {
  const res = await fetch(`/api/post-submissions/${id}/request-deletion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason, authorEmail })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to request post deletion");
  }
  return await res.json();
}

export async function requestPostEditApi(id: string, updatedData: any) {
  const res = await fetch(`/api/post-submissions/${id}/request-edit`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to submit post edit request");
  }
  return await res.json();
}

export async function deletePostSubmissionApi(id: string) {
  const res = await fetch(`/api/post-submissions/${id}`, {
    method: "DELETE"
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete submission");
  }
  return await res.json();
}




