import { Platform, Alert } from 'react-native';

export const showAlert = (title, message, buttons = []) => {
  if (Platform.OS === 'web') {
    // Na web, usa window.confirm ou window.alert
    if (buttons && buttons.length > 1) {
      // Se tem múltiplos botões, usa confirm
      const confirmed = window.confirm(`${title}\n\n${message}`);
      if (confirmed && buttons[1]?.onPress) {
        buttons[1].onPress();
      } else if (!confirmed && buttons[0]?.onPress) {
        buttons[0].onPress();
      }
    } else {
      // Se tem só um botão, usa alert
      window.alert(`${title}\n\n${message}`);
      if (buttons[0]?.onPress) {
        buttons[0].onPress();
      }
    }
  } else {
    // No mobile, usa Alert normal
    Alert.alert(title, message, buttons);
  }
};