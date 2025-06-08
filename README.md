# Get It Done

## What is this App?

**Get It Done** is a productivity-focused application designed to help users organize tasks, manage schedules, and stay on top of their goals. With a sleek interface and powerful features, this app ensures you can plan your day effectively and accomplish more.

## Features

- **Task Management**: Create, edit, and delete tasks effortlessly.
- **Weather Integration**: Get real-time weather updates using OpenWeatherMap API.
- **Create Projects**: Organize your asks with custom projects.
- **Widgets**: Get a quick glimpse of your overdue tasks.
- **Cross-Platform**: Works seamlessly across devices.

## API Requirements

This app integrates with the following API:

- **OpenWeatherMap API**: Used to fetch real-time weather data. You will need an API key from [OpenWeatherMap](https://openweathermap.org/api) to enable weather functionality.

## Getting Started

Follow these steps to set up the project locally:

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- OpenWeatherMap API key

### Installation

1. Clone the repository:
  ```bash
  git clone https://github.com/tusharshuklaa/get-it-done.git
  cd get-it-done
  ```

2. Install dependencies:
  ```bash
  npm install
  ```

3. Create a `.env` file in the root directory and add your OpenWeatherMap API key:
  ```env
  VITE_WEATHER_API=your_api_key_here
  ```

4. Start the development server:
  ```bash
  npm start
  ```

5. Open your browser and navigate to `http://localhost:5173`.

### Contributing

Feel free to fork the repository and submit pull requests for new features or bug fixes.

---

Enjoy using **Get It Done** and boost your productivity!