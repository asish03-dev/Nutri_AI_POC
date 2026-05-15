# Beginner's Guide: Connecting React to Django

Welcome! Connecting your frontend (React) to your backend (Django) is a core skill in full-stack development. This guide will walk you through the process step-by-step.

## 1. Capturing User Input (State Management)

In React, we use "State" to keep track of what the user types.

### The `useState` Hook
We use `useState` to create variables that React "watches". When these variables change, React updates the UI.

```javascript
const [email, setEmail] = useState("");
```

### Binding to Inputs
We connect these state variables to our HTML input fields using the `value` and `onChange` attributes.

```javascript
<input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```
*   `value={email}`: Tells the input to show the current value of the `email` state.
*   `onChange`: A function that runs every time the user types. `e.target.value` is what they just typed.

---

## 2. Communicating with the Backend (Axios)

To send data to Django, we use a library called `axios`. It's like a messenger that carries your data to the server and brings back the response.

### Making a POST Request
Registration usually uses a `POST` request because we are *sending* data to be saved.

```javascript
import axios from "axios";

const handleSubmit = async () => {
  try {
    const response = await axios.post("http://localhost:8000/api/register/", {
      username: email, // Django needs a username, we use email
      email: email,
      password: password,
      password2: confirmPassword,
    });
    console.log("Success:", response.data);
  } catch (error) {
    console.error("Error:", error.response.data);
  }
};
```

*   `async/await`: These keywords tell JavaScript to wait for the backend to respond before moving to the next line.
*   `try...catch`: This is how we handle errors. If the backend says "Email already exists", it will jump to the `catch` block.

---

## 3. Handling the Response

Once the backend responds, you need to decide what to do next.

### Success
If the registration is successful, you might want to:
- Show a success message.
- Redirect the user to the Login page.
- Automatically log them in and go to the Dashboard.

### Failure
If there's an error (e.g., password too short), you should:
- Stop the loading spinner.
- Show the error message to the user so they can fix it.

---

## 4. Common Hurdles

### CORS (Cross-Origin Resource Sharing)
By default, browsers block requests from one website (e.g., `localhost:5173`) to another (e.g., `localhost:8000`).
**Solution**: We've already configured `django-cors-headers` in your backend to allow this.

### URL Paths
Ensure your frontend URL matches your backend `urls.py`.
- Backend: `path('register/', RegisterView.as_view())` inside `api/urls.py` which is included under `api/` in `core/urls.py`.
- Resulting URL: `http://localhost:8000/api/register/`

---

## Summary of the Process
1.  **Prepare State**: Create variables for each form field.
2.  **Bind UI**: Connect inputs to state variables.
3.  **Create Handler**: Write an `async` function to handle the button click.
4.  **Send Request**: Use `axios.post` to send data.
5.  **Feedback**: Show success/error messages to the user.
