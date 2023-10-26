# [Rubiks-cube](https://.kyledlong.com)

This project aims to virtualise the movments of a rubiks cube. Created with React and Threejs
<br>

![rubiks-cube-image](./public/rubiks-cube.png)



## Tech

|                   |               |
| ----------------- | ------------- |
| React Three Fiber | Drei          |
| JS                | Three.js      |
| HTML              | CSS           |
| Vite              | Github actions|
| Hostinger         | Webhooks      |



<br>

This project is a basic static website created using HTML, CSS, and JavaScript. For package management and development server, we use npm as the Node Package Manager along with Vite. Our Continuous Integration (CI) process involves automatically building artifacts from the main branch into the build branch whenever changes are pushed. This is achieved through GitHub Actions. Additionally, we have configured a webhook to send a POST request to a specified URL (in our case, Hostinger). As a result, any updates pushed to the main branch will trigger a build and update the production site accordingly.

<br>

## How to Use
<br>

1. Clone the repository:

```bash
git clone https://github.com/KD-Long/rubiks-cube.git
```

2. Install the dependencies:

```bash
cd rubiks-cube
npm install
```

3. Run the project:

```bash
npm run dev
```

3. Open your web browser and navigate to http://localhost:3000 to access the project.