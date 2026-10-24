export default function Stars({ value = 0, size = 18 }) {
    const full = Math.round(value);
    return (
        <span className="stars" style={{ fontSize: size }} aria-label={`${value} out of 5 stars`}>
            {'★'.repeat(full)}{'☆'.repeat(5 - full)}
        </span>
    );
}