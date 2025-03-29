export async function fetchPrivateMessages(user: string, otherUser: string) {
    try {
        const response = await fetch(
            `http://localhost:3003/messages/private?user=${encodeURIComponent(user)}&otherUser=${encodeURIComponent(otherUser)}`
        );
        if (!response.ok) {
            throw new Error(`Failed to fetch messages: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching private messages:', error);
        return [];
    }
}

export async function fetchGroupMessages(groupId: string) {
    try {
        const response = await fetch(`http://localhost:3003/messages/group?groupId=${encodeURIComponent(groupId)}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch group messages: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching group messages:', error);
        return [];
    }
}
