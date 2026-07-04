import { Phone, Mail, Globe, Linkedin, Github, Facebook, Instagram } from 'lucide-react';

export const developer = {
  name: 'Dulana Chathurma',
  role: 'Full Stack Developer | Software Engineering Undergraduate',
  email: 'dulanachathurma99@gmail.com',
  phone: '+94 76 757 4844',
  photo: '/images/developer.jpg',
  links: [
    { label: 'Phone', href: 'tel:+94767574844', icon: Phone, external: false },
    { label: 'Email', href: 'mailto:dulanachathurma99@gmail.com', icon: Mail, external: false },
    { label: 'Portfolio', href: 'https://dulanaportfolio.vercel.app/', icon: Globe, external: true },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/dulana-chathurma', icon: Linkedin, external: true },
    { label: 'GitHub', href: 'https://github.com/dulanachathurma', icon: Github, external: true },
    { label: 'Facebook', href: 'https://web.facebook.com/profile.php?id=61577216859902', icon: Facebook, external: true },
    { label: 'Instagram', href: 'https://www.instagram.com/dulana_chathurma/', icon: Instagram, external: true },
  ],
};
