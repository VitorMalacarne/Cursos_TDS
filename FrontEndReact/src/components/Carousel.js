import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Carousel = ({ children }) => {
    const [index, setIndex] = useState(0);
    const total = children.length;
    const itemsPerPage = 5;

    const nextSlide = () => {
        setIndex((prev) => (prev + itemsPerPage) % total);
    };

    const prevSlide = () => {
        setIndex((prev) => (prev - itemsPerPage + total) % total);
    };

    const getDisplayedItems = () => {
        const displayedItems = [];
        for (let i = 0; i < itemsPerPage; i++) {
            displayedItems.push(children[(index + i) % total]);
        }
        return displayedItems;
    };

    return (
        <div className="carousel-container">
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="carousel-slide"
                >
                    {getDisplayedItems()}
                </motion.div>
            </AnimatePresence>
            <button onClick={prevSlide} className="carousel-button left">
                ◀
            </button>
            <button onClick={nextSlide} className="carousel-button right">
                ▶
            </button>
        </div>
    );
};

export default Carousel;