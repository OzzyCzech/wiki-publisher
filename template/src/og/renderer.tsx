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

function clamp(text: string, max: number): string {
	return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

function titleSize(text: string): number {
	if (text.length > 80) return 56;
	if (text.length > 50) return 68;
	if (text.length > 28) return 84;
	return 96;
}

export function OgImage({ title, description, config }: OgProps) {
	const accent = config.accent ?? ['#4f46e5', '#7c3aed'];
	const text = config.textColor ?? '#0f172a';
	const muted = config.mutedColor ?? '#475569';
	const bg = config.bgGradient ?? 'linear-gradient(135deg, #fafafa 0%, #f1f5f9 100%)';
	const size = titleSize(title);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				height: '100%',
				background: bg,
				padding: '64px 80px',
				fontFamily: 'Inter',
				position: 'relative',
			}}
		>
			{/* Soft accent bloom in the top-right corner */}
			<div
				style={{
					position: 'absolute',
					top: -240,
					right: -240,
					width: 640,
					height: 640,
					borderRadius: 9999,
					background: `radial-gradient(circle, ${accent[0]}55 0%, ${accent[0]}00 70%)`,
				}}
			/>
			{/* Mirrored bloom in bottom-left for balance */}
			<div
				style={{
					position: 'absolute',
					bottom: -300,
					left: -200,
					width: 560,
					height: 560,
					borderRadius: 9999,
					background: `radial-gradient(circle, ${accent[1]}33 0%, ${accent[1]}00 70%)`,
				}}
			/>

			{/* Left accent bar with tapered gradient */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					bottom: 0,
					width: 8,
					background: `linear-gradient(180deg, ${accent[0]} 0%, ${accent[1]} 100%)`,
				}}
			/>

			{/* Header */}
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: 24,
				}}
			>
				<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
					{config.logoSrc ? (
						<img src={config.logoSrc} height={40} alt={config.brand ?? 'Logo'} />
					) : config.brand ? (
						<p
							style={{
								fontSize: 30,
								fontWeight: 800,
								color: text,
								margin: 0,
								letterSpacing: '-0.025em',
							}}
						>
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
								letterSpacing: '0.12em',
								textTransform: 'uppercase',
							}}
						>
							{config.tagline}
						</p>
					)}
				</div>
				{config.domain && (
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 10,
						}}
					>
						<div
							style={{
								width: 8,
								height: 8,
								borderRadius: 9999,
								background: `linear-gradient(135deg, ${accent[0]} 0%, ${accent[1]} 100%)`,
							}}
						/>
						<p style={{ fontSize: 18, color: muted, margin: 0, fontWeight: 500 }}>{config.domain}</p>
					</div>
				)}
			</div>

			<div style={{ flex: 1 }} />

			{/* Title */}
			<p
				style={{
					fontSize: size,
					fontWeight: 800,
					color: text,
					lineHeight: 1.08,
					margin: '0 0 24px',
					letterSpacing: '-0.035em',
					maxWidth: '95%',
				}}
			>
				{title}
			</p>

			{description && (
				<p
					style={{
						fontSize: 26,
						color: muted,
						margin: 0,
						lineHeight: 1.4,
						maxWidth: '88%',
						fontWeight: 400,
					}}
				>
					{clamp(description, 180)}
				</p>
			)}

			{/* Bottom accent line */}
			<div
				style={{
					position: 'absolute',
					left: 80,
					right: 80,
					bottom: 36,
					height: 2,
					background: `linear-gradient(90deg, ${accent[0]}00 0%, ${accent[0]}66 50%, ${accent[1]}00 100%)`,
				}}
			/>
		</div>
	);
}
