// @ts-nocheck
/** @jsxRuntime automatic */
/** @jsxImportSource satori/jsx */

export interface OgConfig {
	brand?: string;
	domain?: string;
	tagline?: string;
	accent?: [string, string];
	textColor?: string;
	mutedColor?: string;
	bgGradient?: string;
	logoSrc?: string;
}

export interface OgProps {
	title: string;
	description?: string;
	config: OgConfig;
}

export function OgImage({ title, description, config }: OgProps) {
	const accent = config.accent ?? ['#4f46e5', '#312e81'];
	const text = config.textColor ?? '#18181b';
	const muted = config.mutedColor ?? '#52525b';
	const bg = config.bgGradient ?? 'linear-gradient(148deg, #f4f4f5 0%, #eef2ff 55%, #e0e7ff 100%)';
	const fontSize = title.length > 60 ? 44 : 54;

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				height: '100%',
				background: bg,
				padding: '56px 72px 56px 78px',
				fontFamily: 'Inter',
				position: 'relative',
			}}
		>
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					bottom: 0,
					width: 6,
					background: `linear-gradient(180deg, ${accent[0]} 0%, ${accent[1]} 100%)`,
				}}
			/>

			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'flex-start',
					justifyContent: 'space-between',
				}}
			>
				<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
					{config.logoSrc ? (
						<img src={config.logoSrc} height={32} alt={config.brand ?? 'Logo'} />
					) : config.brand ? (
						<p style={{ fontSize: 28, fontWeight: 700, color: text, margin: 0, letterSpacing: '-0.02em' }}>
							{config.brand}
						</p>
					) : null}
					{config.tagline && (
						<p
							style={{
								fontSize: 14,
								color: accent[0],
								margin: 0,
								fontWeight: 700,
								letterSpacing: '0.05em',
								textTransform: 'uppercase',
							}}
						>
							{config.tagline}
						</p>
					)}
				</div>
				{config.domain && <p style={{ fontSize: 15, color: muted, margin: 0 }}>{config.domain}</p>}
			</div>

			<div style={{ flex: 1 }} />

			<p
				style={{
					fontSize,
					fontWeight: 700,
					color: text,
					lineHeight: 1.16,
					margin: '0 0 20px',
					letterSpacing: '-0.025em',
				}}
			>
				{title}
			</p>

			{description && (
				<p
					style={{
						fontSize: 21,
						color: muted,
						margin: 0,
						lineHeight: 1.5,
					}}
				>
					{description.length > 160 ? `${description.slice(0, 157)}...` : description}
				</p>
			)}
		</div>
	);
}
