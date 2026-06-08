const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM || 'noreply@apunam.org.ar';

async function sendSolicitudRecibida({ email, nombre_completo, fecha_reserva, salon_nombre }) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Solicitud de Reserva Recibida - APUNAM',
    html: `
      <h2>Hola ${nombre_completo},</h2>
      <p>Su solicitud de reserva fue registrada correctamente.</p>
      <ul>
        <li><strong>Salón:</strong> ${salon_nombre}</li>
        <li><strong>Fecha:</strong> ${fecha_reserva}</li>
      </ul>
      <p>Quedará pendiente hasta validación administrativa.</p>
      <p>Saludos,<br/>APUNAM</p>
    `,
  });
}

async function sendReservaAprobada({ email, nombre_completo, fecha_reserva, salon_nombre }) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Reserva Aprobada - APUNAM',
    html: `
      <h2>Hola ${nombre_completo},</h2>
      <p>Su reserva fue <strong>aprobada</strong>.</p>
      <ul>
        <li><strong>Salón:</strong> ${salon_nombre}</li>
        <li><strong>Fecha:</strong> ${fecha_reserva}</li>
      </ul>
      <p>Debe acercarse a la sede correspondiente para completar documentación y pago.</p>
      <p>Saludos,<br/>APUNAM</p>
    `,
  });
}

async function sendReservaRechazada({ email, nombre_completo, fecha_reserva, salon_nombre }) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Reserva No Aprobada - APUNAM',
    html: `
      <h2>Hola ${nombre_completo},</h2>
      <p>Su solicitud de reserva no pudo ser aprobada.</p>
      <ul>
        <li><strong>Salón:</strong> ${salon_nombre}</li>
        <li><strong>Fecha:</strong> ${fecha_reserva}</li>
      </ul>
      <p>Comuníquese con APUNAM para más información.</p>
      <p>Saludos,<br/>APUNAM</p>
    `,
  });
}

module.exports = { sendSolicitudRecibida, sendReservaAprobada, sendReservaRechazada };
