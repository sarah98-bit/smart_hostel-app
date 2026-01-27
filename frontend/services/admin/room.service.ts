import api from "../api"; // make sure api.ts is correctly set up

// Room interface
export interface Room {
  id: string;
  name: string;
  price_kes_per_month: number;
  createdAt?: string;
  updatedAt?: string;
}

// ✅ Fetch all rooms
export const getRooms = async (): Promise<Room[]> => {
  try {
    const res = await api.get("/admin/rooms");
    return res.data as Room[]; // cast to Room[]
  } catch (error: any) {
    console.error("Get Rooms Error:", error.message || error);
    throw new Error("Failed to fetch rooms");
  }
};

// ✅ Create a new room
export const createRoom = async (room: {
  name: string;
  price_kes_per_month: number;
}): Promise<Room> => {
  try {
    const res = await api.post("/admin/rooms", room);
    return res.data as Room;
  } catch (error: any) {
    console.error("Create Room Error:", error.message || error);
    throw new Error("Failed to create room");
  }
};

// ✅ Update an existing room
export const updateRoom = async (
  id: string,
  room: { name?: string; price_kes_per_month?: number }
): Promise<Room> => {
  try {
    const res = await api.put(`/admin/rooms/${id}`, room);
    return res.data as Room;
  } catch (error: any) {
    console.error("Update Room Error:", error.message || error);
    throw new Error("Failed to update room");
  }
};

// ✅ Delete a room
export const deleteRoom = async (id: string): Promise<{ message: string }> => {
  try {
    const res = await api.delete(`/admin/rooms/${id}`);
    return res.data as { message: string };
  } catch (error: any) {
    console.error("Delete Room Error:", error.message || error);
    throw new Error("Failed to delete room");
  }
};
