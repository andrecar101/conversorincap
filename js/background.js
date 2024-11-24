body {
    margin: 0;
    height: 100vh;
    background: linear-gradient(-45deg, #ff6b6b, #f0e130, #4ecdc4, #ffffff);
    background-size: 400% 400%;
    animation: gradientAnimation 15s ease infinite;
  }
  
  @keyframes gradientAnimation {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  
  .waves {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100px;
    background: url('https://www.transparenttextures.com/patterns/zig-zag-light.png');
    background-size: cover;
    opacity: 0.3;
    animation: moveWaves 10s linear infinite;
  }
  
  @keyframes moveWaves {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX
  