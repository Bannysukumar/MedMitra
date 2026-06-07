const admin = require('firebase-admin')
const path = require('path')
const fs = require('fs')

const keyPath = path.join(__dirname, '..', '..', 'medmitra-46913-firebase-adminsdk-fbsvc-711f4a8ae5.json')
const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })

const FACILITIES = [
  { id: 'medplus-hyd-1', name: 'MedPlus Pharmacy', type: 'pharmacy', address: 'Road No. 12, Banjara Hills, Hyderabad', lat: 17.4126, lng: 78.4482, status: 'open', rating: 4.8, phone: '+91 40 2345 1111', hours: '24 Hours' },
  { id: 'healthcare-mart-1', name: 'HealthCare Mart', type: 'pharmacy', address: 'MG Road, Secunderabad, Hyderabad', lat: 17.4399, lng: 78.4983, status: 'open', rating: 4.5, phone: '+91 40 2789 2222', hours: '8:00 AM - 10:00 PM' },
  { id: 'city-medical-hall-1', name: 'City Medical Hall', type: 'pharmacy', address: 'Ameerpet, Hyderabad', lat: 17.4375, lng: 78.4482, status: 'open', rating: 4.2, phone: '+91 40 2345 3333', hours: '9:00 AM - 9:00 PM' },
  { id: 'apollo-hospital-1', name: 'Apollo Hospitals', type: 'hospital', address: 'Jubilee Hills, Hyderabad', lat: 17.4239, lng: 78.4071, status: 'open', rating: 4.7, phone: '+91 40 2360 7777', hours: '24 Hours Emergency' },
  { id: 'city-heart-care-1', name: 'City Heart Care Hospital', type: 'hospital', address: 'Banjara Hills, Hyderabad', lat: 17.4156, lng: 78.4347, status: 'open', rating: 4.6, phone: '+91 40 2345 6789', hours: '24 Hours' },
  { id: 'care-clinic-1', name: 'MedMitra Care Clinic', type: 'clinic', address: 'Hitech City, Hyderabad', lat: 17.4435, lng: 78.3772, status: 'open', rating: 4.4, phone: '+91 40 2345 4444', hours: '10:00 AM - 8:00 PM' },
]

async function main() {
  const batch = admin.firestore().batch()
  FACILITIES.forEach((f) => {
    batch.set(admin.firestore().doc(`medicalFacilities/${f.id}`), f)
  })
  await batch.commit()
  console.log('Seeded', FACILITIES.length, 'medical facilities')
}

main().catch(console.error)
