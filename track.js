const steps = ["Order received","Packed","Shipped","Out for delivery","Delivered"];

// Edit when an order changes. step: 0-4
// courier and waybill are optional
const orders = {
};

function trackOrder() {
  const id = document.getElementById("track-input").value.trim().toUpperCase();
  const out = document.getElementById("track-result");
  const o = orders[id];
  if (!o) {
    out.innerHTML = "<p>Order not found. Check your number or WhatsApp us.</p>";
    return;
  }
  let html = "<p>Delivering to: <b>" + o.town + ", " + o.province + "</b></p>";
  html += steps.map((s, i) =>
    '<div class="t-step ' + (i <= o.step ? 'done' : '') + '">' + s + '</div>'
  ).join("");
  if (o.waybill) {
    html += "<p>Courier: " + o.courier + "<br>Waybill: <b>" + o.waybill + "</b></p>";
  }
  out.innerHTML = html;
}