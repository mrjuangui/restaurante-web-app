import React, { useEffect, useState } from 'react';

const ToastNotification = ({ mensaje, tipo = 'success', duracion = 2000 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (mensaje) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, duracion);
      return () => clearTimeout(timer);
    }
  }, [mensaje, duracion]);

  if (!visible) return null;

  return (
    <div className={`toast-notification ${tipo}`}>
      {mensaje}
    </div>
  );
};

export default ToastNotification;
