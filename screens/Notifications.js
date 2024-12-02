import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const NotificationScreen = ({ notifications = [], visible, onClose }) => {
  // Check if notifications is an array and log an error if it's not
  if (!Array.isArray(notifications)) {
    console.error('Notifications should be an array.');
    return null;  // Return null if notifications is not an array
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Notifications</Text>
          {notifications.length === 0 ? (
            <Text style={styles.modalContent}>No new notifications.</Text>
          ) : (
            <View style={styles.notificationsList}>
              {notifications.map((notification) => (
                <View key={notification.id} style={styles.notificationItemContainer}>
                  <Text style={styles.notificationTitle}>
                    {notification.title}
                  </Text>
                  <Text style={styles.notificationMessage}>
                    {notification.message}
                  </Text>
                </View>
              ))}
            </View>
          )}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalContent: {
    fontSize: 16,
    marginBottom: 20,
  },
  notificationsList: {
    marginBottom: 20,
    width: '100%',
  },
  notificationItemContainer: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: '100%',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007BFF",
  },
  notificationMessage: {
    fontSize: 14,
    color: "#333",
  },
  closeButton: {
    backgroundColor: "#007BFF",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default NotificationScreen;
