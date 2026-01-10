import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

const breakpoints = useBreakpoints(breakpointsTailwind);

export const useDevice = () => {
    const activeBreakpoint = breakpoints.active();

    const isMobile = breakpoints.smaller("md");
    const isTablet = breakpoints.between("md", "lg");
    const isDesktop = breakpoints.greaterOrEqual("lg");
    const isLargeDesktop = breakpoints.greaterOrEqual("xl");

    return {
        activeBreakpoint,
        isMobile,
        isTablet,
        isDesktop,
        isLargeDesktop,
    };
};
