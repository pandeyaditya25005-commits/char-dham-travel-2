const path = require("path");
const fs = require("fs");

const loadInvoiceTemplate = (booking) => {
  const templatePath = path.join(__dirname, "..", "templates", "bookingInvoice.html");
  let html = fs.readFileSync(templatePath, "utf-8");

  const itemRows = booking.type === "package"
    ? `<tr>
        <td>${booking.packageId ? booking.packageId.title : 'Tour Package'}</td>
        <td>${booking.numberOfPersons} persons</td>
        <td>₹${(booking.totalAmount / booking.numberOfPersons).toFixed(2)}</td>
        <td>₹${booking.totalAmount.toFixed(2)}</td>
      </tr>`
    : `<tr>
        <td>${booking.hotelId ? booking.hotelId.name : 'Hotel'} - ${booking.roomId ? booking.roomId.type : 'Room'}</td>
        <td>${booking.numberOfRooms || 1} room(s) x ${Math.ceil((new Date(booking.endDate) - new Date(booking.travelDate)) / (1000*60*60*24))} nights</td>
        <td>₹${(booking.totalAmount / ((booking.numberOfRooms || 1) * Math.ceil((new Date(booking.endDate) - new Date(booking.travelDate)) / (1000*60*60*24)))).toFixed(2)}</td>
        <td>₹${booking.totalAmount.toFixed(2)}</td>
      </tr>`;

  const statusBadge = {
    pending: '#f59e0b',
    confirmed: '#10b981',
    cancelled: '#ef4444',
    completed: '#3b82f6',
  }[booking.status] || '#6b7280';

  const replacements = {
    bookingId: booking.bookingId,
    bookingDate: new Date(booking.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
    customerName: booking.contactEmail,
    customerEmail: booking.contactEmail,
    customerPhone: booking.contactPhone,
    travelDate: new Date(booking.travelDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
    endDate: new Date(booking.endDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
    persons: booking.numberOfPersons.toString(),
    itemRows: itemRows,
    subtotal: `₹${booking.totalAmount.toFixed(2)}`,
    total: `₹${booking.totalAmount.toFixed(2)}`,
    amountInWords: numberToWords(booking.totalAmount),
    status: booking.status.toUpperCase(),
    statusColor: statusBadge,
    type: booking.type === 'package' ? 'Tour Package' : 'Hotel Booking',
  };

  for (const [key, value] of Object.entries(replacements)) {
    html = html.replace(new RegExp(`{{${key}}}`, "g"), value);
  }

  return html;
};

const numberToWords = (num) => {
  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convert = (n) => {
    if (n === 0) return '';
    if (n < 10) return units[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + units[n % 10] : '');
    return units[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
  };

  const whole = Math.floor(num);
  const fraction = Math.round((num - whole) * 100);

  let result = 'Rupees ';
  if (whole >= 10000000) {
    result += convert(Math.floor(whole / 10000000)) + ' Crore ';
    whole %= 10000000;
  }
  if (whole >= 100000) {
    result += convert(Math.floor(whole / 100000)) + ' Lakh ';
    whole %= 100000;
  }
  if (whole >= 1000) {
    result += convert(Math.floor(whole / 1000)) + ' Thousand ';
    whole %= 1000;
  }
  if (whole >= 100) {
    result += convert(Math.floor(whole / 100)) + ' Hundred ';
    whole %= 100;
  }
  if (whole > 0) {
    result += convert(whole);
  }
  if (fraction > 0) {
    result += ' and ' + convert(fraction) + ' Paise';
  }
  result += ' Only';

  return result;
};

module.exports = { loadInvoiceTemplate };
