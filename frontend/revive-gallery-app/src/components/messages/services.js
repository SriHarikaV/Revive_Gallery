const baseUrl = "http://localhost:8080/api";

export async function createChatRoom(receiver, message) {
  return (
    await fetch(`${baseUrl}/messages/createChatRoom`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      //   credentials: "include",
      body: JSON.stringify({
        message: message,
        sender: JSON.parse(localStorage.getItem("user"))._id,
        receiver,
      }),
    })
  ).json();
}

export async function getUserConversations(receiver) {
  return (
    await fetch(`${baseUrl}/messages/getUserConversations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: JSON.parse(localStorage.getItem("user"))._id,
      }),
    })
  ).json();
}

export async function sendMessage(chatId, message) {
  return (
    await fetch(`${baseUrl}/messages/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      //   credentials: "include",
      body: JSON.stringify({
        sender: JSON.parse(localStorage.getItem("user"))._id,
        chatId,
        message,
      }),
    })
  ).json();
}
export async function updateProductStatus(productId, status) {
  return (
    await fetch(`${baseUrl}/product`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      //   credentials: "include",
      body: JSON.stringify({
        _id: productId,
        buyer: JSON.parse(localStorage.getItem("user"))._id,
        status,
      }),
    })
  ).json();
}
