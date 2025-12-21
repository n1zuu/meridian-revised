# Meridian - Restaurant Management System

Meridian is a full-stack web application designed to streamline restaurant operations. It facilitates interaction between customers, waiters, cashiers, and managers through a unified interface for ordering, order tracking, payment processing, and staff management.

## Features

* **Role-Based Access Control:** Distinct dashboards for Customers, Waiters, Cashiers, and Managers.
* **Digital Menu & Ordering:** Customers or Waiters can browse the menu and place orders directly to the kitchen.
* **Real-time Order Status:** Track orders through stages (Pending -> Cooking -> Ready -> Completed/Cancelled).
* **Cashier Dashboard:**
    * View active and completed orders.
    * Process payments via Cash, Card, or E-Wallets (GCash/PayPal).
    * Generate and view digital receipts.
    * Handle order cancellations (Soft Delete).
* **Manager/Admin Panel:**
    * View transaction history with date filters.
    * Manage staff accounts (Add/Remove Waiters & Cashiers).
    * Oversee operational metrics.
* **Responsive Design:** Optimized for tablets (POS usage) and mobile devices.

## Tech Stack

### Frontend
* **Framework:** React.js (Vite)
* **Styling:** Tailwind CSS
* **State Management:** React Context API (AuthContext)
* **HTTP Client:** Axios
* **Routing:** React Router DOM

### Backend
* **Framework:** Django & Django REST Framework (DRF)
* **Database:** SQLite (Development) / PostgreSQL (Recommended for Production)
* **Authentication:** JWT (JSON Web Tokens) or Token Authentication
* **Media Handling:** Django Media files for menu images

## Project Structure

```
meridian/
├── backend/                # Django Project
│   ├── media/              # Uploaded menu images
│   ├── restaurant/         # Main app logic (models, views, serializers)
│   ├── meridian_backend/   # Project settings & URL config
│   └── manage.py
├── frontend/               # React Project
│   ├── src/
│   │   ├── components/     # Reusable UI components (CashierDashboard, etc.)
│   │   ├── services/       # API services (axiosClient.js)
│   │   ├── context/        # Auth context
│   │   └── utils/          # Helpers (getImage.js)
│   ├── public/             # Static assets
│   └── capacitor.config.json # Mobile configuration
└── README.md
```

## Installation & Setup
### Prerequisites
- Node.js & npm
- Python 3.8+
- Android Studio (for mobile build)

1. Backend Setup (Django)
```
cd meridian-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install django djangorestframework django-cors-headers

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create a superuser (Manager)
python manage.py createsuperuser

# Start server
python manage.py runserver 0.0.0.0:8000
```

2. Frontend Setup (React)
```
cd meridian-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## License
This project is licensed under the GNU 3.0 General Public License.

## Contributors
This would not have been made possible without the contributions made by https://github.com/anaric4.
