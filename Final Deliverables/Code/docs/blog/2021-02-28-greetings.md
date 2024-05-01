---
slug: greetings
title: Greetings!
authors:
  - name: Faraz Mansur
    title: Co-creator of Docusaurus 1
    url: https://github.com/Zossima-F
    image_url: https://avatars.githubusercontent.com/u/95336337?s=400&u=43a8d8e33aa7158d14e2899d36d2ae6d711770cc&v=4
  - name: Ahmed Iqbal
    title: Docusaurus maintainer
    url: https://sebastienlorber.com
    image_url: https://github.com/slorber.png
tags: [greetings]
---

Congratulations, you have made your first post!

Feel free to play around and edit this post as much you like.

export const Highlight = ({children, color}) => (
  <span
    style={{
      backgroundColor: color,
      borderRadius: '20px',
      color: '#fff',
      padding: '10px',
      cursor: 'pointer',
    }}
    onClick={() => {
      alert(`You clicked the color ${color} with label ${children}`)
    }}>
    {children}
  </span>
);

This is <Highlight color="#25c2a0">Docusaurus green</Highlight> !

This is <Highlight color="#1877F2">Facebook blue</Highlight> !