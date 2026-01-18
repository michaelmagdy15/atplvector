# ATPL Vector (Community Edition)

<div align="center">
  <h3>A Modern, Open-Source Platform for ATPL Theory</h3>
  <p>Practice Questions • Interactive Simulations • Strategic Planning</p>
  <p>
    <b>A Spiritual Successor to <a href="https://github.com/PupoSDC/chair-flight">Chair Flight</a></b><br>
    <i>Built with ❤️ for the aviation community, continuing the mission of free, high-quality training.</i>
  </p>
</div>

---

## 🚀 About This Project

ATPL Vector is a next-generation study platform for EASA ATPL students. It was built to extend the incredible work done by the **Chair Flight** project (created by [PupoSDC](https://github.com/PupoSDC)), which hasn't seen updates in a while. 

We took the robust open-source question database and wrapped it in a brand new, high-fidelity experience featuring:

*   **Interactive 3D Visualizations**: Visualize complex aerodynamics and systems (powered by React Three Fiber).
*   **Strategic Exam Planner**: An intelligent tool to manage your 6 sittings and 18-month window.
*   **Smart Question Bank**:
    *   **ECQB 2024/2026** ready.
    *   **AI-Driven Explanations**: Generate detailed explanations on demand using Gemini AI.
    *   **Error Attribution**: Track *why* you missed a question (Concept vs. Formula vs. Misread).
*   **"Drip" Aesthetic**: A premium, engaging UI designed to keep you motivated.

## 🤝 Credits & Attribution

This project stands on the shoulders of giants. 
**A massive thank you to [PupoSDC](https://github.com/PupoSDC) and contributors of [Chair Flight](https://github.com/PupoSDC/chair-flight)** for creating the open-source ECQB database structure and initial platform concept.

We are releasing this platform under the **GPL-3.0 License** to ensure it remains free and open for all future pilots, just as Chair Flight intended.

## 🛠️ Getting Started

### Prerequisites

*   Node.js (v18+)
*   npm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/atplvector.git
    cd atplvector
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment:**
    Copy `.env.example` to `.env.local` and add your keys (optional, for AI features).
    ```bash
    cp .env.example .env.local
    ```

4.  **Run Locally:**
    ```bash
    npm run dev
    ```

## 🌟 Contributing

We welcome contributions! Whether it's adding new 3D modules, fixing question data, or improving the Planner algorithm.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the GNU General Public License v3.0. See `LICENSE` for more information.
