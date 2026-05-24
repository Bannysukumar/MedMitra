const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp()

exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
  await admin.firestore().collection('users').doc(user.uid).set({
    uid: user.uid,
    email: user.email,
    fullName: user.displayName || '',
    role: 'user',
    plan: 'free',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  })
})

exports.onOrderCreate = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    const order = snap.data()
    functions.logger.info('New order created', { orderId: context.params.orderId, userId: order.userId })
  })

exports.sendOrderStatusNotification = functions.firestore
  .document('orders/{orderId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data()
    const after = change.after.data()
    if (before.status !== after.status) {
      functions.logger.info('Order status updated', {
        orderId: context.params.orderId,
        status: after.status,
      })
    }
  })
