import { GridContainer } from './GridContainer';
import { PERSONAL } from '@/lib/data';
import { ArrowUpRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 py-8">
      <GridContainer className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0">
        {/* Copyright */}
        <div className="font-mono text-xs text-zinc-400">
          © {new Date().getFullYear()} {PERSONAL.name}
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-6 md:justify-center">
          <a
            href={PERSONAL.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-mono text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            GitHub
            <ArrowUpRight size={10} />
          </a>
          <a
            href={PERSONAL.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-mono text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            LinkedIn
            <ArrowUpRight size={10} />
          </a>
        </div>

        {/* Location */}
        <div className="font-mono text-xs text-zinc-400 md:text-right">
          {PERSONAL.location} · {PERSONAL.timezone}
        </div>
      </GridContainer>
    </footer>
  );
}
